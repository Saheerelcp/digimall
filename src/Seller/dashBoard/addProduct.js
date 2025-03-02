import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/addProduct.css';
import { FaSearch, FaUpload, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

function AddProduct() {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

  const sellerId = localStorage.getItem('sellerId');

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
        const response = await fetch(`http://localhost:5129/api/products/${sellerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5129/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.fileUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5129/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  const handleAddProduct = async () => {
    if (!sellerId) {
      alert('Seller not logged in.');
      return;
    }

    const newProduct = {
      productName,
      price,
      quantity,
      expiryDate,
      image: imageUrl,
      category,
      sellerId,
    };

    try {
      const response = await fetch('http://localhost:5129/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const responseData = await response.json();
      setProducts([...products, { ...newProduct, _id: responseData.productId }]);

      setProductName('');
      setPrice('');
      setQuantity('');
      setExpiryDate('');
      setImageUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    }
  };

  const handleUpdateProduct = async (productId) => {
    const updatedProduct = {
      price: editingProduct.price,
      quantity: editingProduct.quantity,
      expiryDate: editingProduct.expiryDate,
    };

    try {
      const response = await fetch(`http://localhost:5129/api/update-product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, ...updatedProduct } : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product.');
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add Product to {category}</h2>
      <p className="subtext">Add new products to your inventory and manage existing ones.</p>

      {/* Search Box */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}

        />
        <FaSearch className="search-icon" />
      </div>

      {/* Product Input Fields */}
      <div className="product-input">
        <div className="row">
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
        </div>

        <div className="exp-img-block">
          <input className='expiray'
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}

            placeholder="Expiry Date"
          />

          {/* Image Upload Placeholder */}
          <div className="upload-placeholder">
            <label htmlFor="product-image" className="upload-label">
              <FaUpload className="upload-icon" />
              <span>Upload Product Image</span>
            </label>
            <input
              type="file"
              id="product-image"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

        </div>

        <button className="add-btn" onClick={handleAddProduct}><span >+</span>  Add Product</button>
      </div>

      {/* Product List */}
      <div className="products-grid">
        {products
          .filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div className="product-card" key={product._id}>
              <div className="image-placeholder">
                {product.image ? <img src={product.image} alt={product.productName} /> : "No Image"}
              </div>
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p>Price: ${product.price}</p>
                <p>{quantityType(product.category, product.quantity)}</p>
                <p>Expiry: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}</p>
              </div>

              {/* Three Dots Menu */}
              <div className="options-menu" onClick={() => setShowOptions(showOptions === product._id ? null : product._id)}>
                <FaEllipsisV />
                {showOptions === product._id && (
                  <div className="options-dropdown">
                    <FaEdit className="edit-icon" onClick={() => setEditingProduct(product)} />
                    <FaTrash className="delete-icon" onClick={() => handleRemoveProduct(product._id)} />
                  </div>
                )}
              </div>


              {/* Edit Product Popup */}
              {editingProduct && editingProduct._id === product._id && (
                <div className="edit-popup">
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                  />
                  <input
                    type="date"
                    value={editingProduct.expiryDate}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiryDate: e.target.value })}
                  />
                  <button onClick={() => handleUpdateProduct(product._id)}>Save</button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AddProduct;
