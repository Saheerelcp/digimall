const express = require("express");
const router = express.Router();
const Offer = require("../model/Offer");
const Product = require("../model/Product");

// Create an offer
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
      productImage: product.image,
    });
    console.log(offer.productImage);

    // Save the offer
    await offer.save();
    res.status(201).json({ message: "Offer successfully created!", offer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

// Add a new offer
router.post("/add-offer", async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: "Error adding offer", error });
  }
});

// Get all offers for a seller
router.get("/get-offers", async (req, res) => {
  const { sellerId } = req.query;

  try {
    const offers = await Offer.find({ sellerId });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offers", error });
  }
});

// Edit an offer
router.put("/edit-offer/:offerId", async (req, res) => {
  const { offerId } = req.params;

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(offerId, req.body, { new: true });
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: "Error editing offer", error });
  }
});

// Remove an offer
router.delete("/remove-offer/:offerId", async (req, res) => {
  const { offerId } = req.params;

  try {
    await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ message: "Offer removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing offer", error });
  }
});

module.exports = router;
