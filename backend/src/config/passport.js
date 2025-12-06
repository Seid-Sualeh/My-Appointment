const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const crypto = require("crypto");

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:5000/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // Split display name into first and last name
        const nameParts = profile.displayName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        user = await User.create({
          firstName: firstName,
          lastName: lastName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(16).toString("hex"), // Random password for social users
          socialLogin: {
            google: {
              id: profile.id,
              email: profile.emails[0].value,
            },
          },
          emailVerified: true,
        });
      } else if (!user.socialLogin.google || !user.socialLogin.google.id) {
        if (!user.socialLogin) {
          user.socialLogin = {};
        }
        user.socialLogin.google = {
          id: profile.id,
          email: profile.emails[0].value,
        };
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

// Only initialize Facebook strategy if credentials are provided
let facebookStrategy;
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  facebookStrategy = new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : `${profile.id}@facebook.com`;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            socialLogin: {
              facebookId: profile.id,
            },
            emailVerified: true,
          });
        } else if (!user.socialLogin || !user.socialLogin.facebookId) {
          if (!user.socialLogin) {
            user.socialLogin = {};
          }
          user.socialLogin.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  );
}

passport.use(googleStrategy);
if (facebookStrategy) {
  passport.use(facebookStrategy);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
