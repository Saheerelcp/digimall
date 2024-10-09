const express = require('express');
const router = express.Router();
const sellerController = require('../control/sellerController');

// Route for seller signup
router.post('/SignupSeller', sellerController.signupSeller);

// Seller login route
router.post('/SellerLogin', sellerController.loginSeller);

module.exports = router;
