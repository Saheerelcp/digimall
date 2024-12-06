const express = require('express');
const Product = require('../model/Product'); // Import the Product model
const router = express.Router();
//product fetch
// Get products for a specific seller
router.get('/sellers/products/:sellerId', async (req, res) => {
    const { sellerId } = req.params; // Extract sellerId from the URL parameter
  
    try {
      // Fetch products where the sellerId matches the sellerId parameter
      const products = await Product.find({ sellerId });
      
      // If no products are found, return a message
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for this seller' });
      }
  
      // Return the products as a response
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
  
// Rating a product
// router.post('/products/rate/:productId', async (req, res) => {
//   const { productId } = req.params;
//   const { rating } = req.body;

//   // Assuming the customerId is passed in the request header (or you could authenticate the customer)
//   const customerId = req.user._id; 

//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send({ message: 'Product not found' });
//     }

//     // Check if the customer has already rated the product
//     const existingRating = product.ratings.find(r => r.customerId.toString() === customerId.toString());
    
//     if (existingRating) {
//       // Update the existing rating
//       existingRating.rating = rating;
//     } else {
//       // Add a new rating
//       product.ratings.push({ customerId, rating });
//     }

//     await product.save();
//     res.status(200).json(product);
//   } catch (error) {
//     console.error('Error rating product:', error);
//     res.status(500).send({ message: 'Error rating product' });
//   }
// });

module.exports = router;
