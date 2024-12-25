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




// Get all offers for a seller
// Route to get offers based on sellerId
router.get("/get-offers", (req, res) => {
  const { sellerId } = req.query; // Get sellerId from query parameters

  if (!sellerId) {
    return res.status(400).json({ message: "sellerId is required" });
  }

  Offer.find({ sellerId }) // Filter offers based on the sellerId
    .then((offers) => {
      res.json(offers); // Send the filtered offers as JSON response
    })
    .catch((error) => {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to load offers", error });
    });
});
// Edit an offer
// Remove an offer
router.delete("/remove-offer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ message: "Offer successfully removed!", offer: deletedOffer });
  } catch (error) {
    console.error("Error removing offer:", error);
    res.status(500).json({ error: "Failed to remove offer" });
  }
});

// Update an offer
router.put("/update-offer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { discount },
      { new: true } // Return the updated document
    );
    if (!updatedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ message: "Offer successfully updated!", offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ error: "Failed to update offer" });
  }
});


module.exports = router;
