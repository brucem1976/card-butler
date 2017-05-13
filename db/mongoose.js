const TEST_DB = "mongodb://35.188.65.159:27017/Users";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(TEST_DB);

module.exports = {
  mongoose
};