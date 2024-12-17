
const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer"); // Import your customer model

// Route to fetch all addresses for a customer
router.get("/get-address/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Return all addresses
    return res.status(200).json({ address: customer.address || [] });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ message: "Error fetching addresses", error: error.message });
  }
});

// Route to add a new address
router.post("/new-address", async (req, res) => {
  const { customerId, address } = req.body;

  try {
    // Ensure customerId and address are provided
    if (!customerId || !address) {
      return res.status(400).json({ message: "Customer ID and address are required." });
    }

    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Initialize the address array if it doesn't exist
    if (!Array.isArray(customer.address)) {
      customer.address = [];
    }

    // Push the new address to the customer's address array
    customer.address.push(address);

    // Save the updated customer document
    await customer.save();
    console.log(customer.address);
    res.status(200).json({
      message: "Address added successfully!",
      address: customer.address, // Return updated addresses
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Route to update an existing address
router.put("/update-address", async (req, res) => {
  const { customerId, address, index } = req.body;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!customer.address || customer.address.length <= index) {
      return res.status(400).json({ message: "Invalid address index" });
    }

    customer.address[index] = address; // Update the address at the specified index
    await customer.save();

    res.status(200).json({ message: "Address updated successfully!" });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Error updating address", error: error.message });
  }
});

// Route to delete an address
router.delete("/delete-address", async (req, res) => {
  const { customerId, index } = req.body;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!customer.address || customer.address.length <= index) {
      return res.status(400).json({ message: "Invalid address index" });
    }

    customer.address.splice(index, 1); // Remove the address at the specified index
    await customer.save();

    res.status(200).json({ message: "Address deleted successfully!" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Error deleting address", error: error.message });
  }
});

module.exports = router;
