// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const forgotPasswordController = require('../control/forgotPasswordcontroller');
const otpVerificationController = require('../control/otpVerificationController');
const resetPasswordController = require('../control/resetPasswordController');

// Route: POST /api/forgot-password
router.post('/forgot-password', forgotPasswordController);

// Route: POST /api/verify-otp
router.post('/verify-otp', otpVerificationController);

// Route: POST /api/reset-password
router.post('/reset-password', resetPasswordController);

module.exports = router;
