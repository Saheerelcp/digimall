const express = require('express');
const router = express.Router();
const sellerController = require('../control/sellerController');

// Route for seller signup
router.post('/SignupSeller', sellerController.signupSeller);

module.exports = router;

