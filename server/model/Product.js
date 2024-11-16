const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: false },
  image: { type: String, required: false},
  category: { type: String, required: true },
  sellerId: { type: String, required: true }, // Ensure sellerId is included
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
