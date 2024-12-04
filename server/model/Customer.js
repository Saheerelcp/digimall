const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
  // Add other customer-specific fields here
  address: {
    country: String,
    fullName: String,
    mobileNumber: String,
    pinCode: String,
    houseNumber: String,
    area: String,
    landmark: String,
    city: String,
    state: String,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
