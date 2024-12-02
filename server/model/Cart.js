const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  customerId: { 
    type: Schema.Types.ObjectId, // Use ObjectId to reference another document
    ref: "Customer",            // Reference the Customer model
    required: true 
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      category:String,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
