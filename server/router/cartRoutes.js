const express = require("express");
const Cart = require("../model/Cart"); // Import the Cart model
const router = express.Router();

// Add product to cart
router.post("/cart/add", async (req, res) => {
  const { customerId, product, sellerId } = req.body;

  try {
    // Find the cart for the customer
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ customerId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      // If the product exists, update the quantity
      existingItem.quantity += product.quantity;
    } else {
      // Add the new product to the cart with the seller ID and category
      cart.items.push({ ...product, sellerId, category: product.category });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding product to cart", error });
  }
});

// Get cart details
router.get("/cart/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch the cart for the given customer ID
    const cart = await Cart.findOne({ customerId }).populate({
      path: "customerId",
      select: "email", // Fetch only the email from the Customer model
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ message: "Error fetching cart details", error });
  }
});

// Remove an item from the cart by productId
router.delete("/cart/remove/:productId", async (req, res) => {
  const { productId } = req.params;
  const { customerId } = req.body;

  if (!customerId || !productId) {
    return res.status(400).json({ message: "Missing customerId or productId" });
  }

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
