/* eslint-disable no-console */

// port and host name config
const port = 9000;
const hostname = 'localhost';

/* load modules */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
// eslint-disable-next-line no-unused-vars
const flash = require('connect-flash');
const session = require('express-session');
/* load local components ie. models */
const Friend = require('./models/friend');
const States = require('./libs/statesCollection');
/* set up express framework */
const app = express();

/* set up mongoose to connect to our MongoDb server */
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost/firstnodeapp');
const db = mongoose.connection;

db.on('error', (error) => {
  console.log(error);
});

db.once('open', () => {
  console.log('Connected to Database');
});

// set up view render engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// configure middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());

app.use((req, res, next) => {
  // eslint-disable-next-line global-require
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter(param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value,
    };
  },
}));

// routes
app.get('/', (req, res) => {
  Friend.find({}, 'first_name last_name ', (err, friends) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Online Contact Book Home page',
        friends,
      });
    }
  });
});

app.get('/friend/details/:id', (req, res) => {
  Friend.findById(req.params.id, (err, friend) => {
    if (err) {
      console.log(err);
    }

    res.render('friend-details', {
      title: 'Online Contact Book Home page',
      friend,
    });
  });
});

app.get('/friend/add', (req, res) => {
  res.render('friend-add', {
    title: 'Add Friend Details',
    states: States.states,
  });
});

app.post('/friend/add', (req, res) => {
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

app.delete('/friend/delete/:id', (req, res) => {
  Friend.findByIdAndDelete(req.params.id, (err) => {
    if (err) console.log(err);
    else {
      res.send('success');
    }
  });
});

app.get('/friend/update/:id', (req, res) => {
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

app.post('/friend/update/:id', (req, res) => {
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

// server setup
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server started on ${hostname}:${port}`);
});
