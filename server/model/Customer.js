const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  country: String,
  fullName: String,
  mobileNumber: String,
  pinCode: String,
  houseNumber: String,
  area: String,
  landmark: String,
  city: String,
  state: String,
});

const CustomerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
  address: { type: [AddressSchema], default: [] }, // Array of addresses
});

module.exports = mongoose.model('Customer', CustomerSchema);
