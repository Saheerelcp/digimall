const express = require('express');
const router = express.Router();
const customerController = require('../control/customerController');

// Route for customer sign-up
router.post('/SignupCustomer', customerController.signupCustomer);
// Customer login route
router.post('/CustomerLogin', customerController.loginCustomer);
module.exports = router;
