const express = require("express");
const router = express.Router();
const Offer = require("../model/Offer");
const Product = require("../model/Product");

router.post("/create-offers", async (req, res) => {
  try {
    const { discount, discountEndDate, discountStartDate, expiryDate, price, quantity, sellerId, productId } = req.body;
    console.log('Seller ID:', sellerId);

    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create the offer
    const offer = new Offer({
      sellerId,
      productId,
      productName: product.productName,
      quantity,
      price,
      expiryDate,
      discount,
      discountStartDate,
      discountEndDate,
    });

    // Save the offer
    await offer.save();
    res.status(201).json({ message: "Offer successfully created!", offer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer" });
  }
});


module.exports = router;
