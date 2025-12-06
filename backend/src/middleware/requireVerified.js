const requireVerified = (req, res, next) => {
  // Skip for social login users (they're auto-verified)
  if (req.user.socialLogin?.googleId || req.user.socialLogin?.facebookId) {
    return next();
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      message: "Please verify your email address to access this feature.",
      requiresVerification: true,
    });
  }

  next();
};

module.exports = requireVerified;
