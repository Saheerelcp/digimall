const Notification = require("../model/Notifications");

// Function to save notification to the database
const sendNotification = async (sellerId, message) => {
  try {
    if (!sellerId) {
      console.warn("⚠️ No sellerId provided for notification.");
      return;
    }

    // Save the notification in the database
    await Notification.create({
      sellerId,
      message,
      timestamp: new Date(),
      read: false,
    });

    console.log(`✅ Notification saved for seller ${sellerId}: ${message}`);
  } catch (error) {
    console.error("❌ Error saving notification:", error);
  }
};

// Function to fetch notifications for a seller
const getNotifications = async (req, res) => {
  try {
    const { sellerId } = req.params;
    if (!sellerId) {
      return res.status(400).json({ error: "Seller ID is required" });
    }

    const notifications = await Notification.find({ sellerId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendNotification, getNotifications, markAsRead };
