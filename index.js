const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const helmet = require('helmet')
const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy
const knex = require('knex')(require('./knexfile.js'))
require('dotenv').config()
require('./passport.js')
const app = express()
const PORT = process.env.PORT || 5050

app.use(express.json())

app.use(helmet())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
  }),
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: false,
  }),
  function (req, res) {
     res.redirect('http://localhost:5173/profile');
  },
);
app.use(passport.initialize());
app.use(passport.session());
// Assuming your existing imports and setup are above this code

app.post('/auth/logout', (req, res) => {
  // Destroy the user session to log them out
  req.logout();
  req.session.destroy();


  res.status(200).json({ message: 'Logout successful' });
});



app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${5050}.`)
})
