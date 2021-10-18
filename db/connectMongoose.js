const mongoose = require('mongoose');

const dbConnect = (uri) => {
  console.log('MongoDB connected successfully');
  return mongoose.connect(uri);
};

module.exports = dbConnect;
