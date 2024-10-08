// router/sellerRoutes.js

const express = require('express');
const router = express.Router();
const sellerController = require('../control/sellerController');

// Route for seller sign-up
router.post('/signup-seller', sellerController.signupSeller);

module.exports = router;
