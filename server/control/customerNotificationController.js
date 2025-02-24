const CustomerNotification = require("../model/customerNotifications");

// Function to save customer notification to the database
const sendCustomerNotification = async (customerId, message) => {
  try {
    if (!customerId) {
      console.warn("⚠️ No customerId provided for notification.");
      return;
    }

    await CustomerNotification.create({
      customerId,
      message,
     
      timestamp: new Date(),
      read: false,
    });

    console.log(`✅ Notification saved for customer ${customerId}: ${message}`);
  } catch (error) {
    console.error("❌ Error saving customer notification:", error);
  }
};

// Function to fetch notifications for a customer
const getCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const notifications = await CustomerNotification.find({ customerId })
      .sort({ timestamp: -1 })
      .limit(50); // Limit to 50 most recent notifications

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching customer notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to mark a customer notification as read
const markCustomerNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    await CustomerNotification.findByIdAndUpdate(notificationId, { read: true });

    res.json({ success: true, message: "Customer notification marked as read" });
  } catch (error) {
    console.error("❌ Error marking customer notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to clear all read notifications for a customer
const clearReadCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    await CustomerNotification.deleteMany({ 
      customerId, 
      read: true 
    });

    res.json({ success: true, message: "Read notifications cleared" });
  } catch (error) {
    console.error("❌ Error clearing read customer notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { 
  sendCustomerNotification, 
  getCustomerNotifications, 
  markCustomerNotificationAsRead,
  clearReadCustomerNotifications
};