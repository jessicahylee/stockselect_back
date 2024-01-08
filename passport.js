require('dotenv').config()

const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
    //   console.log(profile, 'profile')

      return cb(null, { profile })
    },
  ),
  
)
