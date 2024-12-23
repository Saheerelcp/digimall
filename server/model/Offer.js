const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
 
  discount: { type: Number, required: true },
  discountStartDate: { type: Date, required: true },
  discountEndDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
