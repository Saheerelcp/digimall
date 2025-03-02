const express = require("express");
const Seller = require("../model/Seller");

const router = express.Router();

// Get Seller Details
router.get("/details/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params; // Get sellerId from request parameters
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.json({
            sellerName: seller.sellerName,
            shopName: seller.shopName,
            contactNumber: seller.contactNumber,
            shopAddress: seller.shopAddress
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update Seller Details
router.post("/update", async (req, res) => {
    try {
        const { sellerId, sellerName, shopName, contactNumber, shopAddress } = req.body; // Get sellerId from request body

        const updatedSeller = await Seller.findByIdAndUpdate(
            sellerId,
            { sellerName, shopName, contactNumber, shopAddress },
            { new: true }
        );

        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.json({ message: "Details updated successfully!", updatedSeller });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
