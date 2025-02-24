const express = require("express");
const { getNotifications, markAsRead } = require("../control/notificationController");
const Product = require('../model/Product');
const Notification = require('../model/Notifications'); 
const router = express.Router();

// Route to check stock and generate low stock notifications
router.get("/check-stock-alerts", async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const products = await Product.find({ sellerId });
    console.log('hello availability');

    // Loop through each product and check if quantity is less than 5
    for (const product of products) {
      console.log(`Checking product: ${product.productName} - Quantity: ${product.quantity}`);

      if (product.quantity < 5) {
        // Check if a notification already exists for this product
        const existingNotification = await Notification.findOne({
          sellerId: product.sellerId,
          message: { $regex: product.productName, $options: 'i' }, // Avoid duplicate messages
          read: false
        });

        if (!existingNotification) {
          // Create a new notification only if it doesn't already exist
          const notification = new Notification({
            sellerId: product.sellerId, // Use sellerId from product
            message: `⚠️ Low stock alert: ${product.productName} has only ${product.quantity} left!`,
            createdAt: new Date(),
            read: false
          });

          console.log('Displaying notification:', notification);
          await notification.save(); // Save notification
        } else {
          console.log(`Notification for ${product.productName} already exists. Skipping.`);
        }
      }
    }

    res.status(200).json({ message: "Stock check completed" });
  } catch (error) {
    console.error("Error checking stock alerts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get notifications for a seller
router.get("/notifications/:sellerId", getNotifications);

// Route to mark a notification as read
router.post("/notifications/read", markAsRead);

module.exports = router;
