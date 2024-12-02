const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: false },
  image: {type:String , required:true},
  category: { type: String, required: true },
  sellerId: { type: String, required: true }, // Ensure sellerId is included
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  ratings: [{
    rating: { type: Number, enum: [0, 1], required: true }, // 0 = Dislike, 1 = Like
    createdAt: { type: Date, default: Date.now }
  }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
