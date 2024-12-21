import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/addProduct.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-box"
      />
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
      {error && <div className="error-message">{error}</div>}
      <div className="products-grid">
        {products
          .filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div className="product-card" key={product._id}>
              <div className="image-placeholder">
                {product.image ? (
                  <img src={product.image} alt={product.productName} />
                ) : (
                  'No Image'
                )}
              </div>
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p>Price: ${product.price}</p>
                <p>{quantityType(product.category, product.quantity)}</p>
                <p>Expiry: {product.expiryDate || 'N/A'}</p>
                <button
                  className="edit-button"
                  onClick={() => setEditingProduct(product)}
                >
                  <FaEdit />
                </button>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveProduct(product._id)}
                >
                  <FaTrash />
                </button>
              </div>
              {editingProduct && editingProduct._id === product._id && (
                <div className="edit-popup">
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    value={editingProduct.expiryDate}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleUpdateProduct(product._id)}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AddProduct;
