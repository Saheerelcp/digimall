import React, { useEffect, useState } from "react";
import "../../styles/offer.css"; // Import the CSS file

const OfferForm = () => {
  const [existingProducts, setExistingProducts] = useState([]); // To store existing products
  const [selectedProduct, setSelectedProduct] = useState(null); // To store the selected product details
  const [newProduct, setNewProduct] = useState({
    productName: "",
    quantity: "",
    price: "",
    expiryDate: "", // Keep this as a string to store the formatted date
    discount: 0,
    discountStartDate: "",
    discountEndDate: "",
  });
  const [error, setError] = useState(null);

  // Helper function to format date into yyyy-MM-dd
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format as yyyy-MM-dd
  };

  useEffect(() => {
    // Fetch the seller's existing products (adjust endpoint as per your backend)
    const sellerId = localStorage.getItem("sellerId");
    if (sellerId) {
      fetch(`http://localhost:5129/api/products-quantity?sellerId=${sellerId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the data to check the response
          if (Array.isArray(data)) {
            setExistingProducts(data); // Set the products in the state
          } else {
            setError("Failed to load products. Data is not in expected format.");
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setError("Failed to load products");
        });
    }
  }, []);

  const handleProductSelect = (productId) => {
    // Ensure productId is defined and then find the selected product
    if (!productId) return; // Do nothing if productId is invalid or empty

    console.log("Selected Product ID:", productId); // Log the selected product ID

    // Find the selected product from existingProducts
    const product = existingProducts.find((prod) => prod._id === productId); // Use `_id` to match the product
    
    if (product) {
      console.log("Selected Product:", product); // Log the full product data
      console.log('product image:'+product.image);
      setSelectedProduct(product); // Update selected product if found
      // Set the new product details based on the selected product
      setNewProduct({
        ...newProduct,
        productName: product.productName || "",
        quantity: product.quantity || "",
        price: product.price || "",
        image : product.image,
        expiryDate: formatDate(product.expiryDate) || "", // Format the expiryDate
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure that discount dates are in correct order
    if (newProduct.discountStartDate && newProduct.discountEndDate) {
      const startDate = new Date(newProduct.discountStartDate);
      const endDate = new Date(newProduct.discountEndDate);
      if (startDate > endDate) {
        setError("Discount start date cannot be later than the end date.");
        return;
      }
    }

    const sellerId = localStorage.getItem("sellerId");

    // Ensure that productId is selected before proceeding
    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    // Prepare the form data
    const offerData = {
      sellerId,
      productId: selectedProduct._id, // Use selected product's _id as the productId
      productName: newProduct.productName,
      quantity: newProduct.quantity,
      price: newProduct.price,
      expiryDate: newProduct.expiryDate,
      discount: newProduct.discount,
      discountStartDate: newProduct.discountStartDate,
      discountEndDate: newProduct.discountEndDate,
      productImage: selectedProduct.image,
    };

    // Send the request to the backend
    fetch("http://localhost:5129/api/create-offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the proper content type
      },
      body: JSON.stringify(offerData), // Stringify the data for the backend
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Offer added:", data);
        alert("Offer successfully added!");
        // Reset the form or redirect to another page
      })
      .catch((error) => {
        console.error("Error adding offer:", error);
        setError("Failed to add offer");
      });
  };

  return (
    <div className="complete-body">
      <div className="offer-form">
        <h1>Add New Offer</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Product</label>
            <select
              onChange={(e) => handleProductSelect(e.target.value)}
              value={selectedProduct?.id || ""}
            >
              <option value="">-- Select Product --</option>
              {existingProducts.length > 0 ? (
                existingProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))
              ) : (
                <option value="">No products available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={newProduct.productName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={newProduct.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Percentage</label>
            <input
              type="number"
              name="discount"
              value={newProduct.discount}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Start Date</label>
            <input
              type="date"
              name="discountStartDate"
              value={newProduct.discountStartDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount End Date</label>
            <input
              type="date"
              name="discountEndDate"
              value={newProduct.discountEndDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit">Add Offer</button>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
