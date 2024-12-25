const express = require("express");
const Cart = require("../model/Cart"); // Import the Cart model
const router = express.Router();


router.post("cart/add", async (req, res) => {
  const { customerId, product, sellerId } = req.body;

  try {
    // Find the customer's cart or create a new one if not exists
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({ customerId, products: [] });
    }

    // Ensure products is always an array
    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === product.productId
    );

    if (existingProductIndex > -1) {
      // Update the quantity and price if the product already exists
      const existingProduct = cart.products[existingProductIndex];
      existingProduct.quantity += product.quantity;
      existingProduct.price = product.price * existingProduct.quantity;
      cart.products[existingProductIndex] = existingProduct;
    } else {
      // Add new product to the cart
      cart.products.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        image: product.image,
        shopName: product.shopName,
        sellerId,
      });
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Product added to cart!" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "An error occurred while adding the product to the cart." });
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