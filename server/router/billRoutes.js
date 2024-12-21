const express = require("express");
const router = express.Router();
const CustomerBill = require("../model/customerBill"); // Your CustomerBill model
const Order = require("../model/Order");
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
    console.log(`product id:${productId}`)
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
  
      // Check if sufficient quantity is available
      if (product.quantity < purchasedQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
  
      // Deduct the purchased quantity
      product.quantity -= purchasedQuantity;
  
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

router.post("/create-customer-bill", async (req, res) => {
    try {
        const { customerId, sellerId, items, totalAmount } = req.body;
        console.log(items.quantity);
        // Calculate the total amount from items if needed
        const calculatedAmount = items.reduce((total, item) => total + item.amount, 0);

        if (calculatedAmount !== totalAmount) {
            return res.status(400).json({ message: "Total amount mismatch." });
        }

        // Create the new customer bill
        const newCustomerBill = new CustomerBill({
            customerId,
            sellerId,
            items,
            totalAmount,
        });

        // Save the customer bill to the database
        const savedBill = await newCustomerBill.save();

        // Optionally, update the order status or perform other actions
        // Example: Update the order status to "Payment successful"
        const order = await Order.findOne({ customerId, status: "Order sent to seller" });

        if (order) {
            order.status = "Payment successful";
            await order.save();
        }

        res.status(201).json({
            message: "Customer bill created successfully",
            billId: savedBill._id,
            billDetails: savedBill,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Backend Route to Fetch Customer Bills for Seller


// Fetch customer bills for a specific seller
router.get("/seller-bills/:sellerId", async (req, res) => {
    const { sellerId } = req.params; // Seller ID to filter bills

    try {
        // Fetch all customer bills for the given seller
        const bills = await CustomerBill.find({ sellerId })
            .populate("customerId", "address.fullName address.mobileNumber address.houseNumber address.area address.city address.state address.pinCode")  // Populate address fields correctly
            .populate("sellerId", "shopName")  // Populating seller details (optional)
            .exec();

        if (!bills.length) {
            return res.status(404).json({ message: "No bills found for this seller." });
        }

        // Format the customer address to a string or object as needed for frontend
        const formattedBills = bills.map(bill => {
            const { customerId, items, totalAmount, orderDate } = bill;
            const { address } = customerId;
            console.log(items.quantity);
            // Format address as a string for easier frontend rendering
            const addressString = `${address.houseNumber}, ${address.area}, ${address.city}, ${address.state}, ${address.pinCode}`;
            console.log(`customer name:${address.fullName}`);
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
        console.error(err);
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
