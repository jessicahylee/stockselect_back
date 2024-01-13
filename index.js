// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');
// const helmet = require('helmet');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const knex = require('knex')(require('./knexfile.js'));
// require('dotenv').config();
// require('./passport.js');

// const app = express();
// const PORT = process.env.PORT || 5050;

// app.use(express.json());
// app.use(helmet());

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   }),
// );

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//   }),
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });


// passport.deserializeUser((id, done) => {
//   knex('users')
//     .where({ id: id })
//     .then((user) => {
//       done(null, user[0]);
//     })
//     .catch((err) => {
//       done(err, user.id);
//     });
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       const user = {
//         id: profile.id,
//         // Add any other user information you want to store in the user object
//       };

//       console.log('Google Profile:', profile);
//       console.log('User Object:', user);

//       knex('users')
//         .select('id')
//         .where({ id: google.id })
//         .then((existingUser) => {
//           if (existingUser.length) {
//             // If user is found, pass the user object to serialize function
//             done(null, existingUser[0]);
//           } else {
//             // If user isn't found, we create a record
//             knex('users')
//               .insert({
//                 id: google.id,
//                 avatar_url: profile._json.avatar_url,
//                 username: profile.username,
//               })
//               .returning('*') // This ensures that it returns the inserted row
//               .then((newUser) => {
//                 // Pass the user object to serialize function
//                 done(null, newUser[0]);
//               })
//               .catch((err) => {
//                 console.log('Error creating a user', err);
//                 done(err, null);
//               });
//           }
//         })
//         .catch((err) => {
//           console.log('Error fetching a user', err);
//           done(err, null);
//         });
//     }
//   )
// );

// // Google authentication routes
// app.get(
//   '/auth/google',
//   (req, res, next) => {
//     console.log('Starting Google authentication process');
//     passport.authenticate('google', {
//       scope: ['profile'],
//       prompt: 'select_account',
//     })(req, res, next);
//   }
// );

// app.get(
//   '/auth/google/callback',
//   (req, res, next) => {
//     console.log('Handling Google callback');
//     passport.authenticate('google', {
//       failureRedirect: 'http://localhost:5173/login',
//     })(req, res, next);
//   },
//   (_req, res) => {
//     console.log('Redirecting to profile route');
//     res.redirect('http://localhost:5173/profile');
//   },
// );

// // Logout route
// app.post('/auth/logout', (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.status(200).json({ message: 'Logout successful' });
// });

// // Profile route
// app.get('/auth/profile', (req, res) => {
//   if (req.isAuthenticated()) {
//     console.log('User is authenticated');
//     res.status(200).json(req.user);
//   } else {
//     console.log('User is not authenticated');
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server listening on port ${PORT}.`);
// });




const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const knex = require('knex')(require('./knexfile.js'));
require('dotenv').config();
require('./passport.js');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // In a real application, you would fetch user information from the database
  // Example: User.findById(id, (err, user) => done(err, user));
  done(null, { id });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      const user = {
        id: profile.id,
        // Add any other user information you want to store in the user object
      };

      console.log('Google Profile:', profile);
      console.log('User Object:', user);

      return cb(null, user);
    },
  ),
);
// Google authentication routes
app.get(
  '/auth/google',
  (req, res, next) => {
    console.log('Starting Google authentication process');
    passport.authenticate('google', {
      scope: ['profile'],
      prompt: 'select_account',
    })(req, res, next);
  }
);

app.get(
  '/auth/google/callback',
  (req, res, next) => {
    console.log('Handling Google callback');
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:5173/login',
    })(req, res, next);
  },
  (_req, res) => {
    console.log('Redirecting to profile route');
    res.redirect('http://localhost:5173/profile');
  },
);

//Logout route
app.post('/auth/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({ message: 'Logout successful' });
});

// Profile route
app.get('/auth/profile', (req, res) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    res.status(200).json(req.user);
  } else {
    console.log('User is not authenticated');
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});


