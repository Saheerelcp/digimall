const express = require('express');
const router = express.Router();
const sellerController = require('../control/sellerController');
const Seller=require('../model/Seller');

// Route for seller signup
router.post('/SignupSeller', sellerController.signupSeller);

// Seller login route
router.post('/SellerLogin', sellerController.loginSeller);

// Route to get sellerId by email
router.get('/seller-id/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find the seller in the database using the email
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Send back the sellerId
        res.status(200).json({ sellerId: seller._id });
    } catch (error) {
        console.error('Error fetching seller ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch all seller details
router.get("/sellers", async (req, res) => {
    try {
      const sellers = await Seller.find({});
      res.status(200).json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ error: "Failed to fetch seller details" });
    }
  });
module.exports = router;
