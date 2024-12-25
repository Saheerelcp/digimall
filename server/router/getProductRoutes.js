const express = require('express');
const router = express.Router();
const Product = require('../model/Product'); // Import Product model
const Offer = require('../model/Offer');
router.put('/update-product/:productId', async (req, res) => {
  const { productId } = req.params;
  const { price, quantity, expiryDate } = req.body;
  console.log('productId'+productId);
  console.log('hi')
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { price, quantity, expiryDate },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});

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
// Route to get products with offers
router.get("/sellers/products/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  
  try {
    // Fetch all products from the seller
    const products = await Product.find({ sellerId });
    
    // Fetch all offers related to these products
    const offers = await Offer.find({ sellerId });

    // Combine products with their respective offers
    const productsWithOffers = products.map((product) => {
      const productOffer = offers.find((offer) => offer.productId.toString() === product._id.toString());
      return {
        ...product.toObject(),
        offer: productOffer || null, // If no offer, set to null
      };
    });

    res.json(productsWithOffers);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

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
