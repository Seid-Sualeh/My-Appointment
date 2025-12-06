// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Protect routes - require authentication
// const protect = async (req, res, next) => {
//   let token;

//   // Check for token in header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(" ")[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from token (exclude password)
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "User not found with this token",
//         });
//       }

//       // Check if user is active
//       if (req.user.status === "suspended") {
//         return res.status(403).json({
//           success: false,
//           message: "Account suspended. Please contact support.",
//         });
//       }

//       // Check if user account is locked
//       if (req.user.isLocked && req.user.isLocked()) {
//         return res.status(423).json({
//           success: false,
//           message:
//             "Account temporarily locked due to multiple failed login attempts",
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth middleware error:", error);
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized to access this route",
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized, no token",
//     });
//   }
// };

// // Optional authentication - doesn't fail if no token
// const optionalAuth = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//     } catch (error) {
//       // Ignore errors for optional auth
//       console.log("Optional auth failed:", error.message);
//     }
//   }

//   next();
// };

// // Generate JWT token
// const getSignedJwtToken = function (id) {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // Send token response
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = getSignedJwtToken(user._id);

//   const options = {
//     expires: new Date(
//       Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === "production") {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie("token", token, options)
//     .json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//         isEmailVerified: user.isEmailVerified,
//         status: user.status,
//       },
//     });
// };

// // Verify JWT token without middleware
// const verifyToken = async (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");
//     return user;
//   } catch (error) {
//     throw new Error("Invalid token");
//   }
// };

// // Refresh token validation
// const validateRefreshToken = async (refreshToken) => {
//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user || user.status === "suspended") {
//       throw new Error("User not found or suspended");
//     }

//     return user;
//   } catch (error) {
//     throw new Error("Invalid refresh token");
//   }
// };

// // Generate refresh token
// const getRefreshToken = function (id) {
//   return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: "7d",
//   });
// };

// module.exports = {
//   protect,
//   optionalAuth,
//   getSignedJwtToken,
//   sendTokenResponse,
//   verifyToken,
//   validateRefreshToken,
//   getRefreshToken,
// };



















const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = { protect, generateToken };