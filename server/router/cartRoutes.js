const express = require("express");
const Cart = require("../model/Cart"); // Import the Cart model
const router = express.Router();

router.post("/cart/add", async (req, res) => {
  const { customerId, product, sellerId } = req.body;

  try {
    // Find the cart for the customer, now including sellerId at the top level
    let cart = await Cart.findOne({ customerId, sellerId });

    console.log(`Cart found for customerId: ${customerId}, sellerId: ${sellerId}`);

    if (!cart) {
      // Create a new cart if it doesn't exist for the specific seller
      cart = new Cart({ customerId, sellerId, items: [] });
    }

    // Check if the product already exists in the cart from this seller
    const existingItem = cart.items.find((item) => item.productId === product.productId);

    if (existingItem) {
      // If the product exists, update the quantity
      existingItem.quantity += product.quantity;
    } else {
      // Add the new product to the cart
      cart.items.push({ ...product, sellerId });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding product to cart", error });
  }
});
 
router.get("/cart/:customerId/:sellerId", async (req, res) => {
  const { customerId, sellerId } = req.params;

  console.log(`Received customerId: ${customerId}, sellerId: ${sellerId}`);

  try {
    // Fetch the cart for the given customerId and sellerId
    const cart = await Cart.findOne({ customerId, sellerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ message: "Error fetching cart details", error });
  }
});
 
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

    // Filter the cart items by removing the item with the given productId
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await cart.save();

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/cart/update", async (req, res) => {
  const { customerId, sellerId, productId, quantity } = req.body;

  try {
    // Find the cart for the given customer and seller
    const cart = await Cart.findOne({ customerId, sellerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart and update its quantity
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity of the product
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart to the database
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;