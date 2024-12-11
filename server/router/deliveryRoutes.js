const express = require("express");
const router = express.Router();

const customerBill = require("../model/customerBill");

// Fetch delivery updates for a specific customer
router.get("/delivery-updates/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch orders for the given customerId
    const order = await customerBill.findOne({ customerId }); // Replace with your DB query
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/customer/delivery-updates/:customerId", async (req, res) => {
  const { customerId } = req.params; // Assume you have middleware to set userId
  console.log(`here is badassumaaaaaaaaaaa:${customerId}`);
  try {
    const orders = await customerBill.find({ customerId }); // Fetch orders for this customer
    console.log(orders);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No delivery updates found." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching delivery updates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
