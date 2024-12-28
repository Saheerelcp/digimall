const express = require("express");
const router = express.Router();
const CustomerBill = require("../model/customerBill"); // Your CustomerBill model

const Product = require("../model/Product"); // Order model (if needed for tracking)
const Cart = require("../model/Cart"); // Cart model
// Fetch the cart for a specific customer
router.get("/cart/:customerId", async (req, res) => {
    try {
        const { customerId } = req.params;
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/purchase', async (req, res) => {
    const { productId, purchasedQuantity } = req.body;
    console.log(`product id:${purchasedQuantity}`)
    try {
      // Validate input
      if (!productId || !purchasedQuantity) {
        return res.status(400).json({ message: 'Product ID and purchased quantity are required' });
      }
  
      // Find the product by ID
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      console.log('product quantity',+product.quantity);
      // Check if sufficient quantity is available
      
      
        product.quantity -= purchasedQuantity;
      
  
      // Deduct the purchased quantity
      
  
      // Save the updated product
      await product.save();
      
      // Send success response
      res.status(200).json({
        message: 'Purchase successful',
        productName: product.productName,
        remainingQuantity: product.quantity,
      });
    } catch (error) {
      console.error('Error updating product quantity:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });



// Backend Route to Fetch Customer Bills for Seller


// Fetch customer bills for a specific seller
router.get("/seller-bills/:sellerId", async (req, res) => {
  const { sellerId } = req.params; // Seller ID to filter bills

  try {
      // Fetch all customer bills for the given seller
      const bills = await CustomerBill.find({ sellerId }).exec();

      if (!bills.length) {
          return res.status(404).json({ message: "No bills found for this seller." });
      }

      // Format the customer address to a string or object as needed for frontend
      const formattedBills = bills.map(bill => {
          const { address, items, totalAmount, orderDate } = bill;
          // Format address as a string for easier frontend rendering
          const addressString = `${address.houseNumber}, ${address.area}, ${address.city}, ${address.state}, ${address.pinCode}`;
          console.log(`Customer Name: ${address.fullName}`);

          return {
              _id: bill._id,
              customerName: address.fullName,
              customerMobile: address.mobileNumber,
              customerAddress: addressString, // Or pass as an object if needed
              orderDate,
              items,
              totalAmount,
          };
      });

      res.json({ bills: formattedBills });
  } catch (err) {
      console.error("Error fetching seller bills:", err);
      res.status(500).json({ error: "An error occurred while fetching the bills." });
  }
});


router.patch("/update-bill/:billId", async (req, res) => {
    const { billId } = req.params;
    const { expectedDelivery, status } = req.body;
    console.log(`bill id:${billId}`);
    try {
      const bill = await CustomerBill.findByIdAndUpdate(
        billId,
        { expectedDelivery, status },
        { new: true }
      );
  
      if (!bill) {
        return res.status(404).json({ message: "Bill not found." });
      }
  
      res.status(200).json({ message: "Bill updated successfully.", bill });
    } catch (error) {
      console.error("Error updating bill:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

module.exports = router;
