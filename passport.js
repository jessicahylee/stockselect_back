require('dotenv').config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.serializeUser((user, done) => {
  done(null, user.id); // Assuming user.id is unique to identify the user
});

passport.deserializeUser((id, done) => {
  // Use the id to fetch user information from your database
  // Example: User.findById(id, (err, user) => done(err, user));
  done(null, { id }); // Update this based on how you fetch user information
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      // Store relevant information in the user object
      const user = {
        id: profile.id, // Assuming profile.id is a unique identifier
        // Other user information from profile if needed
      };

      // Pass the user object to the done callback
      return cb(null, user);
    }
  )
);








