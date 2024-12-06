const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  status: { type: String, required: true }, // Example: "Order sent to seller", "Out for delivery", etc.
  expectedDelivery: { type: Date, required: true },
  billUrl: { type: String }, // Optional field for bill download link
  timestamps: {
    sentToSeller: { type: Date },
    readyForDelivery: { type: Date },
    outForDelivery: { type: Date },
    delivered: { type: Date },
  },
});

module.exports = mongoose.model("Order", OrderSchema);
