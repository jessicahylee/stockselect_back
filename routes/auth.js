const express = require('express')
const router = express.Router()
const passport = require('passport')
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20')


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      // If e-mail in the profile exist in db then trhow an error returning the code
      // cb -> return cb(error, null)

      // client is not in db then create the client and token and return cb(null,{token:"this is where token goes"})
      console.log(cb)
      return cb(null, profile)
    },
  ),
)

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


router.get(
  '/google/callback',
  passport.authenticate('google', {
    // successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
    session: false,
  }),
  (_req, res, done) => {
    res.redirect(process.env.CLIENT_URL)
    return done()
  },
)

router.get('/profile', (req, res) => {
  if (req.user === undefined)
    return res.status(401).json({ message: 'Unauthorized' })
  res.status(200).json(req.user)
})

// router.get('/logout', (req, res) => {
//   req.logout((error) => {
//     if (error) {
//       return res
//         .status(500)
//         .json({ message: 'Server error, please try again later', error: error })
//     }
//     res.redirect(process.env.CLIENT_URL)
//   })
// })

module.exports = router
