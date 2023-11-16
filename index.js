const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const helmet = require('helmet')
const passport = require('passport')
const knex = require('knex')(require('./knexfile.js'))

// const GoogleStrategy = require('passport-google-oauth20')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5050


app.use(express.json())

app.use(helmet())

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

// Include express-session middleware (with additional config options required for Passport session)

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
)



// const authRoutes = require('./routes/auth')

const GoogleStrategy = require('passport-google-oauth20').Strategy


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      // If e-mail in the profile exist in db then trhow an error returning the code
      // cb -> return cb(error, null)

      // client is not in db then create the client and token and return cb(null,{token:"this is where token goes"})
      // console.log(cb)
      return cb(null, profile)
    },
  ),
)
app.get('/auth/google', passport.authenticate('google',{scope:["profile"]}))
app.get('/auth/google/callback',passport.authenticate('google', {
    // successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
    session: false,
  }),
  (_req, res, done) => {
    res.redirect(process.env.CLIENT_URL)
    return done()
  }, ) 

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${5050}.`)
})
