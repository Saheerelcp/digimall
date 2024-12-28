const mongoose = require("mongoose");

const CustomerBillSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  address: {
    country: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pinCode: { type: String, required: true },
    houseNumber: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
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
