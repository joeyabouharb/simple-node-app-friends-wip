const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});
/* exported variableName */
// eslint-disable-next-line no-unused-vars
const Friend = module.exports;
module.exports = mongoose.model('friends', articleSchema);
