const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
