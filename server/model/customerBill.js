const mongoose = require("mongoose");

const CustomerBillSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
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
  status: { type: String}, // Example: "Order sent to seller", "Out for delivery", etc.
  expectedDelivery: { type: Date },
  timestamps: {
    sentToSeller: { type: Date },
    readyForDelivery: { type: Date },
    outForDelivery: { type: Date },
    delivered: { type: Date },
  },
});

module.exports = mongoose.model("CustomerBill", CustomerBillSchema);
