// AddProduct.js
import React, { useState } from 'react';
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };

  function quantityType(category, pdctQty) {
    if (['Groceries', 'Vegetables', 'Fruits', 'Bakery', 'cakes'].includes(category)) {
        return <p>Quantity: {`${pdctQty} kg`}</p>;
    } else {
        return <p>Quantity: {`${pdctQty} items`}</p>;
    }
  }

  const handleAddProduct = () => {
    const newProduct = { productName, price, quantity, expiryDate, image, category };
    setProducts([...products, newProduct]);
    
    // Clear inputs after adding
    setProductName('');
    setPrice('');
    setQuantity('');
    setExpiryDate('');
    setImage(null);
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

      {/* Display Products in Grid */}
      <div className="products-grid">
        {products
          .filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
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
                
                {/* Call quantityType to render the appropriate quantity text */}
                {quantityType(product.category, product.quantity)}
                
                <p>Expiry: {product.expiryDate || 'N/A'}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AddProduct;
