const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiration: { type: Date, default: null },
  sellerName: { type: String, required: true },
  shopName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  shopAddress: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // References Product collection
});

module.exports = mongoose.model('Seller', SellerSchema);
