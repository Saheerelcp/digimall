import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "../../styles/customerDashboard.css";

const CustomerDashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch seller data from the backend
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("http://localhost:5129/api/sellers");
        if (!response.ok) {
          throw new Error("Failed to fetch sellers");
        }
        const data = await response.json();
        setSellers(data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  // Filter sellers based on search term
  const filteredSellers = sellers.filter((seller) =>
    seller.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle profile icon click
  const handleProfileClick = () => {
    navigate("/customer-profile"); // Navigate to CustomerProfile page
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
          <span className="company-name">G & T</span>
        </div>
        <div className="header-middle">
          <input
            type="text"
            placeholder="Search for shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
        <div className="header-right">
          <FaUser
            className="icon profile-icon"
            onClick={handleProfileClick} // Call handleProfileClick when clicked
          />
        </div>
      </header>

      {/* Sellers Section */}
      <section className="shops-section">
        {filteredSellers.map((seller) => (
          <div className="shop-block" key={seller._id}>
            <img
              src={seller.shopIcon || "/default-shop-icon.png"}
              alt="Shop Icon"
              className="shop-icon"
            />
            <h3>{seller.shopName}</h3>
            <p>Seller: {seller.sellerName}</p>
            <p>Contact: {seller.contactNumber}</p>
            <div className="shop-actions">
              <button
                className="shop-now-btn"
                onClick={() => handleShopNow(seller._id)}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

// Handle the "Shop Now" action
const handleShopNow = (sellerId) => {
  localStorage.setItem("sellerId", sellerId);
  window.location.href = `/shop/${sellerId}`;
};

export default CustomerDashboard;
