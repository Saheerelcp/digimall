const mongoose = require('mongoose');

// Define seller schema
const sellerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure the username is unique
  },
  password: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
});

// Create and export seller model
const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
