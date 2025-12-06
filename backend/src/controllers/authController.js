const crypto = require("crypto");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendResendVerificationEmail,
} = require("../utils/emailService");

// =========================================================================
// 🔐 Authentication Handlers
// =========================================================================

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, businessName } =
      req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "customer",
      phone,
      businessName: role === "business" ? businessName : undefined,
    });

    // Generate email verification token and send email
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      // Log error but proceed with registration success
      console.error("Failed to send verification email:", emailError);
    }

    // Generate auth token (send back to client)
    const token = user.getSignedJwtToken(); // Assuming model has getSignedJwtToken method

    res.status(201).json({
      success: true,
      token,
      message:
        "Registration successful. Please check your email for verification.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Log user in
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check account lockout status (assuming model has isLocked and incLoginAttempts)
    if (user.isLocked && user.isLocked()) {
      return res
        .status(403)
        .json({ message: "Account is locked. Please try again later." });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Increment login attempts if comparison fails
      await user.incLoginAttempts();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName, // Using the virtual field
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Log user out (Client-side token removal)
 * @route POST /api/v1/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    // Note: Logging out is primarily handled by the client destroying the JWT.
    // The server just confirms the action.
    res.json({
      success: true,
      message: "Logged out successfully (Please delete token on client-side).",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Generate a new JWT (used for maintaining session validity)
 * @route GET /api/v1/auth/token
 */
exports.refreshToken = async (req, res) => {
  try {
    // req.user.id is set by the protect middleware after verifying the old token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      expiresIn: process.env.JWT_EXPIRE,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================================
// 📩 Email Verification Handlers
// =========================================================================

/**
 * @desc Verify user email using a crypto-hashed token
 * @route GET /api/v1/auth/verifyemail/:token
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token received from the URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and check expiration
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    // Update user status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Resend verification email
 * @route POST /api/v1/auth/resendverification
 */
exports.resendVerification = async (req, res) => {
  try {
    // Get user from the request body or via middleware if authenticated
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendResendVerificationEmail(user, verificationToken);

      res.json({
        success: true,
        message: "Verification email sent successfully.",
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Clear token if email fails
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================================
// 🔑 Password Reset Handlers
// =========================================================================

/**
 * @desc Initiates password reset by sending a token email
 * @route POST /api/v1/auth/forgotpassword
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Security measure: Send a generic success message even if the user is not found.
    if (!user) {
      return res.json({
        success: true,
        message:
          "If your email exists in our system, you will receive a password reset link.",
      });
    }

    // Generate reset token and save
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(user, resetToken);

      res.json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (emailError) {
      // Clear token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      console.error("Failed to send password reset email:", emailError);
      return res
        .status(500)
        .json({ message: "Failed to send password reset email." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Resets password using the token from the email link
 * @route PUT /api/v1/auth/resetpassword/:token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and check expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+passwordHistory");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Check if password is in history
    if (await user.isPasswordInHistory(newPassword)) {
      return res.status(400).json({
        message:
          "You cannot use a previously used password. Please choose a new password.",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Add to password history (keep last 5 passwords)
    if (!user.passwordHistory) user.passwordHistory = [];
    user.passwordHistory.push({
      password: user.password,
      changedAt: new Date(),
    });

    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }

    await user.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user);
    } catch (emailError) {
      console.error("Failed to send password changed email:", emailError);
    }

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Allows an authenticated user to change their password
 * @route PUT /api/v1/auth/changepassword
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // Select password field to allow comparison
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 2. Check if the new password is the same as current
    const isSameAsCurrent = await user.matchPassword(newPassword);
    if (isSameAsCurrent) {
      return res.status(400).json({
        message: "New password cannot be the same as current password",
      });
    }

    // 3. Update password (Mongoose pre-save hook handles hashing)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================================
// 👤 Profile Management
// =========================================================================

/**
 * @desc Get current authenticated user details
 * @route GET /api/v1/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // req.user.id is populated by the protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName, // Using the virtual field
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update user profile (name, phone, business details)
 * @route PUT /api/v1/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, businessName, businessDescription } =
      req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update standard fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    // Update business specific fields if role is business
    if (user.role === "business") {
      if (businessName) user.businessName = businessName;
      if (businessDescription) user.businessDescription = businessDescription;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        businessName: user.businessName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update user notification preferences
 * @route PUT /api/v1/auth/preferences/notifications
 */
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, pushNotifications } =
      req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the preferences object exists
    if (!user.preferences) user.preferences = {};

    if (emailNotifications !== undefined)
      user.preferences.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined)
      user.preferences.smsNotifications = smsNotifications;
    if (pushNotifications !== undefined)
      user.preferences.pushNotifications = pushNotifications;

    await user.save();

    res.json({
      success: true,
      message: "Notification preferences updated",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Check the current email verification status of the user
 * @route GET /api/v1/auth/status/verification
 */
exports.checkVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      emailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete the authenticated user's account
 * @route DELETE /api/v1/auth/account
 */
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================================
// 🌐 Social Auth
// =========================================================================

/**
 * @desc Handles the final step of social login (e.g., Google/Facebook OAuth callback)
 * @route GET /api/v1/auth/google/callback, /api/v1/auth/facebook/callback
 */
exports.socialLogin = async (req, res) => {
  try {
    // req.user is typically set by the Passport middleware after successful authentication
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Social login authentication failed" });
    }

    // Generate token for the newly authenticated/registered user
    const token = req.user.getSignedJwtToken();

    // For OAuth callbacks, we need to redirect to frontend with token
    // Create a redirect URL with token as hash parameter (more secure than query params)
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5174";
    const redirectUrl = `${frontendUrl}/auth/social-callback#token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        businessName: req.user.businessName,
      })
    )}`;

    // Redirect to frontend
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Social login error:", error);
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5174";
    res.redirect(
      `${frontendUrl}/auth/social-callback#error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

/**
 * @desc Handles Firebase social login by exchanging Firebase token for app token
 * @route POST /api/v1/auth/firebase-social-login
 */
exports.firebaseSocialLogin = async (req, res) => {
  try {
    const { provider, firebaseToken, userData } = req.body;

    if (!provider || !userData?.email) {
      return res.status(400).json({
        message: "Provider and user email are required",
      });
    }

    // Find or create user based on Firebase authentication
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      // Create new user from Firebase data
      const nameParts = userData.displayName
        ? userData.displayName.split(" ")
        : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = await User.create({
        firstName,
        lastName,
        email: userData.email,
        password: crypto.randomBytes(16).toString("hex"), // Random password for social users
        socialLogin: {
          [provider]: {
            id: userData.uid,
            email: userData.email,
            providerId: userData.providerId,
          },
        },
        emailVerified: true, // Firebase users are considered verified
      });
    } else {
      // Update existing user with social login info
      if (!user.socialLogin) {
        user.socialLogin = {};
      }
      if (!user.socialLogin[provider]) {
        user.socialLogin[provider] = {
          id: userData.uid,
          email: userData.email,
          providerId: userData.providerId,
        };
        await user.save();
      }
    }

    // Generate token for the user
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Firebase social login error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc Handles API-based social login (for direct API calls, not OAuth callbacks)
 * @route POST /api/v1/auth/social-login
 */
exports.socialLoginApi = async (req, res) => {
  try {
    const { provider, userData } = req.body;

    if (!provider || !userData?.email) {
      return res.status(400).json({
        message: "Provider and user email are required",
      });
    }

    // Find or create user based on social login data
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      // Create new user from social login data
      const nameParts = userData.displayName
        ? userData.displayName.split(" ")
        : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = await User.create({
        firstName,
        lastName,
        email: userData.email,
        password: crypto.randomBytes(16).toString("hex"), // Random password for social users
        socialLogin: {
          [provider]: {
            id: userData.uid,
            email: userData.email,
            providerId: userData.providerId,
          },
        },
        emailVerified: true, // Social login users are considered verified
      });
    } else {
      // Update existing user with social login info
      if (!user.socialLogin) {
        user.socialLogin = {};
      }
      if (!user.socialLogin[provider]) {
        user.socialLogin[provider] = {
          id: userData.uid,
          email: userData.email,
          providerId: userData.providerId,
        };
        await user.save();
      }
    }

    // Generate token for the user
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("API social login error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
