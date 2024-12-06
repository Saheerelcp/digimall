import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import "../../styles/shopPage.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5129/api/sellers/products/${sellerId}`
        );
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  const filteredProducts = products.filter((product) =>
    product.productName &&
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:5129/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          product: {
            productId: product._id,
            name: product.productName,
            price: product.price,
            quantity: 1,
            category:product.category,
            image: product.image,
            shopName: product.shopName,
          },
          sellerId: product.sellerId,
        }),
      });

      if (response.ok) {
        alert("Product added to cart!");
        navigate(`/cart/${customerId}/${sellerId}`);
      } else {
        const error = await response.json();
        alert(`Failed to add product to cart: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    }
  };

  const handleBuyNow = (product) => {
    
    console.log("Buy now:", product);
  };

  return (
    <div className="shop-page">
      {/* Header */}
      <header className="shop-header">
        <h1>Shop</h1>
        <div className="cart-icon" onClick={() => navigate(`/cart/${customerId}`)}>
          <FaShoppingCart size={24} />
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products */}
      {searchQuery && filteredProducts.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.image || "/default-product-image.png"}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!searchQuery || filteredProducts.length === 0) && (
        <div className="all-products">
          <h2>All Products</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.image || "/default-product-image.png"}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
