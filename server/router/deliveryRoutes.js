const express = require("express");
const router = express.Router();
const Order = require("../model/Order"); // Replace with your model

// Fetch delivery updates for a specific customer
router.get("/delivery-updates/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch orders for the given customerId
    const order = await Order.findOne({ customerId }); // Replace with your DB query
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
