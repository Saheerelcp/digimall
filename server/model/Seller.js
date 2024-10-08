// model/Seller.js

const mongoose = require('mongoose');

// Define Seller schema
const sellerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopAddress: { type: String, required: true }
});

// Export Seller model
const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
