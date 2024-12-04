const mongoose = require("mongoose");

const CustomerBillSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }, // sellerId instead of shopId
  orderDate: { type: Date, default: Date.now },
  items: [
    {
      productName: String,
      quantity: Number,
      price: Number,
      expiryDate: Date,
      amount: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model("CustomerBill", CustomerBillSchema);
