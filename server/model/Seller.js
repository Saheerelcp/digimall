const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
  // Add other seller-specific fields here
});

module.exports = mongoose.model('Seller', SellerSchema);
