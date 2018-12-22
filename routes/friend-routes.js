/* eslint-disable no-console */
// configure express and router
const express = require('express');

const router = express.Router();

const Friend = require('../models/friend');
const States = require('../libs/statesCollection');

router.get('/details/:id', (req, res) => {
  Friend.findById(req.params.id, (err, friend) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    res.render('friend-details', {
      title: 'Online Contact Book Home page',
      friend,
    });
  });
});

router.get('/add', (req, res) => {
  res.render('friend-add', {
    title: 'Add Friend Details',
    states: States.states,
  });
});

router.post('/add', (req, res) => {
  req.checkBody('first_name', 'first name is required').notEmpty();
  req.checkBody('last_name', 'last name required').notEmpty();
  req.checkBody('email', 'email required').notEmpty();
  req.checkBody('email', 'this is not a valid email').isEmail();
  req.checkBody('address', 'first name is required').notEmpty();
  req.checkBody('state', 'state address name required').notEmpty();
  req.checkBody('state', 'Please enter a valid state address').contains(States.states);
  req.checkBody('postalcode', 'postal code is required').notEmpty();
  req.checkBody('postalcode', 'not a postal code').isPostalCode();
  req.checkBody('phone', 'phone required').notEmpty();
  req.checkBody('phone', 'please enter a valid mobile phone').isMobilePhone();

  const errors = req.validationErrors();

  if (errors) {
    res.render('add_article', {
      title: 'Add Article',
      errors,
    });
  } else {
    const friend = new Friend();
    friend.first_name = req.body.first_name;
    friend.last_name = req.body.last_name;
    friend.email = req.body.email;
    friend.address = req.body.address;
    friend.state = req.body.state;
    friend.phone = req.body.phone;
    friend.save((err) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Friend Added');
        res.redirect('/');
      }
    });
  }
});

router.delete('/delete/:id', (req, res) => {
  Friend.findByIdAndDelete(req.params.id, (err) => {
    if (err) console.log(err);
    else {
      res.send('success');
    }
  });
});

router.get('/update/:id', (req, res) => {
  Friend.findById(req.params.id, (err, friend) => {
    if (err) console.log(err);
    else {
      res.render('friend-update', {
        states: States.states,
        title: 'update friend',
        friend,
      });
    }
  });
});

router.post('/update/:id', (req, res) => {
  const friend = {};
  friend.first_name = req.body.first_name;
  friend.last_name = req.body.last_name;
  friend.email = req.body.email;
  friend.address = req.body.address;
  friend.state = req.body.state;
  friend.postalcode = req.body.postalcode;
  friend.phone = req.body.phone;

  const query = { _id: req.params.id };

  Friend.update(query, friend, (err) => {
    if (err) console.log(err);
    else {
      res.redirect('/');
    }
  });
});
module.exports = router;
