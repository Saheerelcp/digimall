const Product = require('../model/Product');

// Add product function (already handled in route)
exports.addProduct = async (req, res) => {
  const { productName, price, quantity, expiryDate, image , category, sellerId } = req.body;

  try {
    const newProduct = new Product({
      productName,
      price,
      quantity,
      expiryDate,
      image,
      category,
      sellerId
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
};
