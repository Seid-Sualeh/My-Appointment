// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const { body } = require("express-validator");
// const authController = require("../controllers/authController");
// const { protect } = require("../middleware/auth");
// const validate = require("../middleware/validation");

// // Validation rules
// const forgotPasswordValidation = [
//   body("email").isEmail().withMessage("Please enter a valid email"),
// ];

// const resetPasswordValidation = [
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters"),
// ];

// // Validation rules
// const registerValidation = [
//   body("name").trim().notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Please enter a valid email"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters"),
//   body("role")
//     .optional()
//     .isIn(["customer", "business"])
//     .withMessage("Invalid role"),
// ];

// const loginValidation = [
//   body("email").isEmail().withMessage("Please enter a valid email"),
//   body("password").notEmpty().withMessage("Password is required"),
// ];

// // Routes
// router.post("/register", registerValidation, validate, authController.register);
// router.post("/login", loginValidation, validate, authController.login);
// router.get("/me", protect, authController.getMe);

// // Password reset routes
// router.post(
//   "/forgotpassword",
//   forgotPasswordValidation,
//   validate,
//   authController.forgotPassword
// );
// router.put(
//   "/resetpassword/:resettoken",
//   resetPasswordValidation,
//   validate,
//   authController.resetPassword
// );

// // Email verification routes
// router.get("/verify-email/:token", authController.verifyEmail);
// router.post("/resend-verification", protect, authController.resendVerification);

// // Social authentication routes
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   authController.socialLogin
// );

// router.get(
//   "/facebook",
//   passport.authenticate("facebook", {
//     scope: ["email"],
//   })
// );

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   authController.socialLogin
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validation");

// Validation rules
const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const resendVerificationValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

// Existing validation rules
const registerValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["customer", "business"])
    .withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Existing routes
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.get("/me", protect, authController.getMe);

// New routes
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);
router.get("/verifyemail/:token", authController.verifyEmail);
router.post(
  "/resendverification",
  resendVerificationValidation,
  validate,
  authController.resendVerification
);
router.put("/profile", protect, authController.updateProfile);
router.get("/check-verification", protect, authController.checkVerification);

// Social authentication routes (existing)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.socialLogin
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authController.socialLogin
);

// Firebase social login route
router.post("/firebase-social-login", authController.firebaseSocialLogin);

// Social login route (for API-based social login)
router.post("/social-login", authController.socialLoginApi);

module.exports = router;
