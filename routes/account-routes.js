const express = require('express');

const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('account-login', {
    title: 'Login:',
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureflash: true,
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('account-register', {
    title: 'Register an Account',
  });
});

router.post('/register', (req, res) => {
  // implement registration here
});
module.exports = router;
