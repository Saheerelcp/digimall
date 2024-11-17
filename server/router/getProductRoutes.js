const express = require('express');
const router = express.Router();
const Product = require('../model/Product'); // Import Product model

router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    await Product.findByIdAndDelete(productId); // MongoDB method to delete by ID
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});
// Route to fetch products by sellerId
router.get('/products/:sellerId', async (req, res) => {
  const { sellerId } = req.params; // Extract sellerId from the URL parameter

  try {
    // Find products by sellerId in the database
    const products = await Product.find({ sellerId }); 
    if (!products) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }
    res.status(200).json(products); // Return the products
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' }); // If there's an error
  }
});

module.exports = router;
