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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// eslint-disable-next-line no-unused-vars
const flash = require('connect-flash');
const session = require('express-session');

/* load local components ie. models */
const Friend = require('./models/friend');
const User = require('./models/user');

/* set up express framework */
const app = express();

// load up routes
const friendRouter = require('./routes/friend-routes');
const accountRouter = require('./routes/account-routes');

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


// configure authentication cookies
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    });
  },
));
// store userId in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
// configure middleware

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session());

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

// route setup
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
// configure routes
app.use('/friend', friendRouter);
app.user('/account', accountRouter);

// server setup
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server started on ${hostname}:${port}`);
});
