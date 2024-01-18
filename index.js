



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
    origin: process.env.ORIGIN_URL,
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
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // In a real application, you would fetch user information from the database
  console.log(user)
  console.log('im deserializeuser')
  // Example: User.findById(id, (err, user) => done(err, user));
  
  
  done(null, {user});
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      const user = {
        id: profile.id,
        name: profile.displayName,
        picture: profile.photos[0].value,
        // Add any other user information you want to store in the user object
      };

      console.log('Google Profile:', profile);
      console.log('User Object:', user);
      knex('users')
        .select('id')
        .select('avatar_url')
        .select('username')
        .where({ google_id: profile.id })
        .then((existingUser) => {
          if (existingUser.length) {
            console.log('im here');
            // If user is found, pass the user object to serialize function
            console.log(existingUser[0])
            done(null, existingUser[0]); 
            
          } else {
            console.log('im here 2')
            // If user isn't found, we create a record
            knex('users')
              .insert({
                google_id: profile.id,
                avatar_url: profile._json.picture,
                username: profile.displayName,
              })
              .returning('*') // This ensures that it returns the inserted row
              .then((newUser) => {
                console.log('im here3')
                // Pass the user object to serialize function
                done(null, newUser[0]);
              })
              .catch((err) => {
                console.log('Error creating a user', err);
                done(err, null);
              });
          }
        })
        .catch((err) => {
          console.log('Error fetching a user', err);
          done(err, null);
        });
    }
  )
);
//       return cb(null, user);
//     },
//   ),
// );


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
      failureRedirect: process.env.FAILURE_URL,
    })(req, res, next);
  },
  (_req, res) => {
    console.log('Redirecting to profile route');
    res.redirect(process.env.REDIRECT_URL)
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
    // console.log(req.user)
    // console.log(res) // Inseert in table (Database)
    knex('users')
    .where({ id: req.user.id })
    .then(user => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log('req.user:', user[0]);

      // The full user object will be attached to request object as `req.user`
      // done(null, user[0]);
      // res.json(user[0])
      res.status(200).json(user[0]);
    })
    .catch(err => {
      console.log('Error finding user', err);
        res.status(401).json({ message: 'Error finding user' });
    });
  } else {
    console.log('User is not authenticated');
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});


