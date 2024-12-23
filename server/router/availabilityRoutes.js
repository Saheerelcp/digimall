const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// Route to fetch products by sellerId
router.get('/products-quantity', async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Fetch products for the given sellerId and sort by quantity
    const products = await Product.find({ sellerId }).sort({ quantity: 1 });
    
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this seller" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
