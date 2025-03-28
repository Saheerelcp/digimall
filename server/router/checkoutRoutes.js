const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer");
const CustomerBill = require("../model/customerBill");
const {sendNotification} = require('../control/notificationController');
//fetch saved address
router.get("/get-saved-addresses/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ address: customer.address || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to save or update address
router.post("/save-address", async (req, res) => {
  try {
    const { customerId, address } = req.body;

    if (!customerId || !address) {
      return res.status(400).send("Customer ID and address are required.");
    }

    // Find customer and push new address to the array
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $push: { address: address } }, // Append instead of overwrite
      { new: true }
    );

    if (!customer) {
      return res.status(404).send("Customer not found."); 
    }

    res.status(200).json({ message: "Address added successfully", customer });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).send("Error adding address: " + error.message);
  }
});


router.post("/create-customer-bill", async (req, res) => {
  try {
    const { customerId, sellerId, items, totalAmount, address } = req.body;
    console.log("what is the product :"+items);
    // Log the received address for debugging
    console.log("Received address:", address);

    // Validate the request data
    if (!customerId || !sellerId || !items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "All fields are required, including the address." });
    }

    // Create a new customer bill with the provided data
    const customerBill = new CustomerBill({
      customerId,
      sellerId,
      items,
      totalAmount,
      address: {
        country: address.country,
        fullName: address.fullName,
        mobileNumber: address.mobileNumber,
        pinCode: address.pinCode,
        houseNumber: address.houseNumber,
        area: address.area,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
      },
    });

    // Save the bill to the database
    await customerBill.save();
      // 🔹 Trigger Notification for Seller
     // 🔹 Trigger Notification for Seller
     try {
      await sendNotification(sellerId, "📢 New customer bill received!");
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
    }
    // Send a success response
    res.status(201).json({ message: "Customer bill created and sent to the seller successfully!", customerBill });
  } catch (error) {
    console.error("Error creating customer bill:", error);
    res.status(500).json({ message: "Internal server error." });
  }
  
});

module.exports = router;
