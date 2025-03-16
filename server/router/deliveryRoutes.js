const express = require("express");
const router = express.Router();

const customerBill = require("../model/customerBill");

// Fetch delivery updates for a specific customer
router.get("/customer/delivery-updates/:customerId", async (req, res) => {
  const { customerId } = req.params; // Extract customerId from the request parameters
  console.log(`Fetching delivery updates for customerId: ${customerId}`);

  try {
    // Fetch orders for the customer and populate seller data
    const orders = await customerBill.find({ customerId })
      .populate("sellerId", "shopName contactNumber") // Populate shopName and contactNumber
      .select("_id status expectedDelivery sellerId orderDate"); // Select _id instead of orderId

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No delivery updates found." });
    }

    // Format response to include populated seller details
    const formattedOrders = orders.map(order => ({
      _id: order._id, // Keep the original _id
      orderId: order._id.toString(), // Use the _id field as the orderId
      status: order.status,
      expectedDelivery: order.expectedDelivery || "Wait for Seller Response", 
      orderDate:order.orderDate,
      shopName: order.sellerId?.shopName || "Unknown Shop", // Handle missing sellerId or shopName
      contactNumber: order.sellerId?.contactNumber || "No Contact Info", // Handle missing contactNumber
    }));

    console.log(formattedOrders);
    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching delivery updates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.get("/customer/order-details/:customerId/:orderId", async (req, res) => {
  const { customerId, orderId } = req.params;
  console.log(`Fetching order details for customerId: ${customerId}, orderId: ${orderId}`);

  try {
    // Find the order using customerId and orderId
    const order = await customerBill.findOne({ _id: orderId, customerId })
      .select("items totalAmount"); // Select only required fields

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized access." });
    }

    // Format the response
    const formattedOrder = {
      totalAmount: order.totalAmount, // Total amount of the order
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log(formattedOrder);
    res.status(200).json({ order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
