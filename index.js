const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const helmet = require('helmet')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const knex = require('knex')(require('./knexfile.js'))

const app = express()
const PORT = process.env.PORT || 5050

require('dotenv').config()

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
app.use(passport.initialize())
// const authRoutes = require('./routes/auth')
app.use(passport.session())
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile'],
    },
    function (_accessToken, _refreshToken, profile, done) {
      console.log(profile)
      knex('users')
        .select('id')
        .where({ google_id: profile.id })
        .then((user) => {
          if (user.length) {
            // If user is found, pass the user object to serialize function
            done(null, user[0])
          } else {
            // If user isn't found, we create a record
            knex('users')
              .insert({
                google_id: profile.id,
                avatar_url: profile._json.picture,
                username: profile.displayName,
              })
              .then((userId) => {
               console.log(userId)
                done(null, { id: userId[0] })
              })
              .catch((err) => {
                console.log('Error creating a user', err)
              })
          }
        })
        .catch((err) => {
          console.log('Error fetching a user', err)
        })
    },
  ),
)

passport.serializeUser(function (user, done) {
  console.log('serializeUser (user object):', user)
  done(null, user.id)
})

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${5050}.`)
})
