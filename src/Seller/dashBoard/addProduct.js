import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/addProduct.css';

function AddProduct() {
  const { category } = useParams(); // Capture the category from route parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null); // To hold the product image
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // Handle error state

  // Get the seller's ID from local storage
  const sellerId = localStorage.getItem('sellerId');

  // Function to determine quantity type (kg or items)
  const quantityType = (category, pdctQty) => {
    const weightCategories = ['groceries', 'vegetables', 'fruits', 'cakes', 'bakery'];
    return weightCategories.includes(category)
      ? `Quantity: ${pdctQty} kg`
      : `Quantity: ${pdctQty} items`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!sellerId) {
        setError('Seller not logged in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5123/api/products/${sellerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Store products in state
      } catch (err) {
        setError(err.message); // Set error if something goes wrong
      }
    };

    if (sellerId) {
      fetchProducts(); // Fetch products when sellerId is available
    }
  }, [sellerId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };
  
  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5123/api/products/${productId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      const responseData = await response.json();
      console.log(responseData);
  
      // Remove the product from the state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };
  
  const handleAddProduct = async () => {
    // Check if the sellerId exists
    if (!sellerId) {
      alert('Seller not logged in.');
      return;
    }

    const newProduct = {
      productName,
      price,
      quantity,
      expiryDate,
      image,
      category,
      sellerId,
    };

    try {
      // Send the product data to the backend using fetch
      const response = await fetch('http://localhost:5123/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
       // Store productId in localStorage
   

      const responseData = await response.json();
      console.log(responseData);
      localStorage.setItem('productId', responseData.productId);
      // Add product to state for local display
      setProducts([...products, { ...newProduct, _id: responseData.productId }]);

      // Clear inputs after adding
      setProductName('');
      setPrice('');
      setQuantity('');
      setExpiryDate('');
      setImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add Product to {category}</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-box"
      />

      {/* Product Input Fields */}
      <div className="product-input">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {error && <div className="error-message">{error}</div>} {/* Error message display */}

      {/* Display Products in Grid */}
      <div className="products-grid">
        {products
          .filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) && product.category === category
          )
          .map((product, index) => (
            <div className="product-card" key={index}>
              <div className="image-placeholder">
                {product.image ? (
                  <img src={product.image} alt={product.productName} />
                ) : (
                  'Image'
                )}
              </div>
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p>Price: ${product.price}</p>
                <p>{quantityType(product.category, product.quantity)}</p>
                <p>Expiry: {product.expiryDate || 'N/A'}</p>
                <button className="remove-button" onClick={() => handleRemoveProduct(product._id)}>Remove</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AddProduct;
