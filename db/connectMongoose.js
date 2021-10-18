const mongoose = require('mongoose');

const dbConnect = (uri) => {
  console.log('Mongoose Connected!');
  return mongoose.connect(uri);
};

module.exports = dbConnect;
