const express = require("express");
const { getNotifications, markAsRead } = require("../control/notificationController");

const router = express.Router();

// Route to get notifications for a seller
router.get("/notifications/:sellerId", getNotifications);

// Route to mark a notification as read
router.post("/notifications/read", markAsRead);

module.exports = router;
