const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Admin = require("../models/Admin.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        let admin = await Admin.findOne({ email });

        if (!admin) {
          admin = await Admin.create({
            email,
            name,
            picture, // ✅ Save profile photo
          });
        } else if (!admin.picture) {
          // Update photo if not saved yet
          admin.picture = picture;
          await admin.save();
        }

        done(null, admin);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (err) {
    done(err, null);
  }
});
