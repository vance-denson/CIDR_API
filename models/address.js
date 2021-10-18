const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'An address must be provided'],
    trim: true,
  },
  status: {
    type: String,
    default: 'available',
    trim: true,
    enum: ['acquired', 'available'],
  },
});

module.exports = mongoose.model('Address', addressSchema);
