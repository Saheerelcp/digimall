import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShopPage = () => {
  const { sellerId } = useParams(); // Get the seller ID from the URL
  const [products, setProducts] = useState([]); // Store fetched products
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query

  // Log to check the sellerId
  console.log(`Seller ID from URL: ${sellerId}`);

  // Fetch products for the specific seller
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/sellers/products/${sellerId}`);
        const data = await response.json();
        console.log("Fetched Products:", data); // Log to see what data we have
        if (response.ok) {
          setProducts(data);
        } else {
          console.error('Error fetching products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  // Filter products based on the search query, ensuring product.productName is defined
  const filteredProducts = products.filter(product =>
    product.productName && product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Add to cart logic here
  };

  // Handle Buy Now
  const handleBuyNow = (product) => {
    console.log('Buy now:', product);
    // Handle buy now logic here
  };
  
  return (
    <div className="shop-page">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Search Results */}
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
                  <h3>{product.productName}</h3> {/* Changed 'name' to 'productName' */}
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display All Products if No Search Query or No Matches */}
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
                  <h3>{product.productName}</h3> {/* Changed 'name' to 'productName' */}
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    <button onClick={() => handleBuyNow(product)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No products found */}
      {searchQuery && filteredProducts.length === 0 && (
        <div className="no-results">
          <p>No products found for your search.</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
