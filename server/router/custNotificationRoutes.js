const express = require('express');
const router = express.Router();
const {
  sendCustomerNotification,
  getCustomerNotifications,
  markCustomerNotificationAsRead,
  clearReadCustomerNotifications
} = require('../control/customerNotificationController');

// Get notifications for a specific customer
router.get('/:customerId', getCustomerNotifications);

// Mark a specific notification as read
router.post('/read', markCustomerNotificationAsRead);

// Clear read notifications for a customer
router.delete('/clear-read/:customerId', clearReadCustomerNotifications);

module.exports = router;