const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: { type: Date },

});
/* exported variableName */
// eslint-disable-next-line no-unused-vars
const User = module.exports;
module.exports = mongoose.model('users', userSchema);
