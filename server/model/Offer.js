const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  productImage : {type : String , required: true},
  expiryDate: { type: Date, required: true },
  discount: { type: Number, required: true },
  discountStartDate: { type: Date, required: true },
  discountEndDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
