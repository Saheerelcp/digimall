const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// Route to add product
router.post('/add', async (req, res) => {
  const { productName, price, quantity, expiryDate, image, category, sellerId } = req.body;

  try {
    const newProduct = new Product({
      productName,
      price,
      quantity,
      expiryDate,
      image,
      category,
      sellerId
    });

    const savedProduct = await newProduct.save(); // Save the product to the database
    res.status(201).json({ productId: savedProduct._id, message: 'Product added successfully' }); // Return the productId
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});
console.log('hi')
// Update product details by productId


module.exports = router;
