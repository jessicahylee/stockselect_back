const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
    session: false,
  }),
  (_req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: 'Server error, please try again later', error: error });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;

