import mongoose from 'mongoose';

//SCHEMA SETUP WITH VALIDATION, 'Address' MODEL
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

export const Address = mongoose.model('Address', addressSchema);
