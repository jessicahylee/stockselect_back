// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth2').Strategy
// require('dotenv').config()

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env['CLIENT_ID'],
//       clientSecret: process.env['CLIENT_SECRET'],
//       callbackURL: process.env['GOOGLE_CALLBACK_URL'],
//       scope: ['profile'],
//     },
//     function verify(issuer, profile, cb) {
//       console.log(cb)
//       //   return cb(null, profile)
//     },
//   ),
// )



// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return cb(err, user)
//       })
//       console.log('Google profile;', profile.id)
//     },
//   ),
// )
// I need to add the knex HERE *code along