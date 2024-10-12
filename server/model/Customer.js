const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
  // Add other customer-specific fields here
});

module.exports = mongoose.model('Customer', CustomerSchema);
