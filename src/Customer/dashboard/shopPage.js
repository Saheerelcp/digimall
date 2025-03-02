import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaSearch, FaShoppingCart, FaCartPlus, FaMoneyBillWave, FaTag } from "react-icons/fa";
import "../../styles/shopPage.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [offerPopup, setOfferPopup] = useState(null);
  const [showQuantityPopup, setShowQuantityPopup] = useState(null); // Tracks which product's popup is open
  const [selectedQuantity, setSelectedQuantity] = useState(1);

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
          console.log(data);
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
      // Calculate discounted price if an offer exists
      const productOffer = product.offer;
      console.log(productOffer);
      const discountedPrice = productOffer
        ? product.price - (product.price * productOffer.discount) / 100
        : product.price;

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
            price: discountedPrice, // Use discounted price if applicable
            quantity: 1,
            category: product.category,
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
    setShowQuantityPopup(product._id); // Show the popup for the specific product
  };

  const confirmBuyNow = (product) => {
    if (selectedQuantity > product.quantity) {
      alert(`Sorry, only ${product.quantity} items available in stock.`);
      return;
    }
    const productOffer = product.offer;
    const discountedPrice = productOffer
      ? product.price - (product.price * productOffer.discount) / 100
      : product.price;
  
    const selectedProductData = {
      productId: product._id,
      name: product.productName,
      price: discountedPrice,
      quantity: Math.min(selectedQuantity, product.quantity), // Ensure quantity doesn't exceed available stock
      category: product.category,
      image: product.image,
      shopName: product.shopName,
      sellerId: product.sellerId // Include seller ID for checkout process
    };
  
    // Use JSON.stringify to ensure proper storage
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProductData));
    
    // Optional: Add error handling for storage limits
    try {
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProductData));
      setShowQuantityPopup(null);
      navigate(`/checkout`);
    } catch (error) {
      console.error("Error storing product data:", error);
      alert("Unable to process purchase. Please try again.");
    }
  };

  return (
    <div className="shop-page">
      <header className="shop-header">
        <h1 className="shop-name">Give and Take</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="cart-icon" onClick={() =>  navigate(`/cart/${customerId}/${sellerId}`)}>
          <FaShoppingCart size={24} />
        </div>
      </header>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            {product.offer && <FaTag className="offer-icon" onClick={() => setOfferPopup(product._id)} />}
            {offerPopup === product._id && (
              <div className="offer-popup">
                <p>Discount: {product.offer.discount}%</p>
                <p>Valid: {new Date(product.offer.discountStartDate).toLocaleDateString()} - {new Date(product.offer.discountEndDate).toLocaleDateString()}</p>
                <p>New Price: ${((product.price * (1 - product.offer.discount / 100)).toFixed(2))}</p>
                <button onClick={() => setOfferPopup(null)}>Close</button>
              </div>
            )}
            <img className="image-placeholder" src={product.image || "/default-product-image.png"} alt={product.productName} />
            <div className="product-info">
              <h3>{product.productName}</h3>
              <p>Price: ${product.price?.toFixed(2) || "N/A"}</p>
              <p>Quantity:{product.quantity}Items/ Kg</p>
              <div className="product-actions">
               <button className="action-btn" onClick={() => handleAddToCart(product)} title="Add to Cart" >Add to cart</button> 
              <button className="action-btn" onClick={() => handleBuyNow(product)} title="Buy Now" >Buy Now</button>
              </div>
            </div>
            {showQuantityPopup === product._id && (
              <div className="quantity-popup">
                <label>
                  Quantity:
                  <input type="number" min="1" max={product.quantity} value={selectedQuantity} onChange={(e) => setSelectedQuantity(Number(e.target.value))} />
                </label>
                <button onClick={() => confirmBuyNow(product)}>Confirm</button>
                <button onClick={() => setShowQuantityPopup(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
