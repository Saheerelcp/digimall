import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import "../../styles/customerDashboard.css";
import logo from '../../logo-images/logo10-EDIT.jpg';
const CustomerDashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const filteredSellers = sellers.filter((seller) =>
    seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.shopAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileClick = () => {
    navigate(`/profile-icon`);
  };

  const handleNotificationClick = () => {
    navigate(`/notifications-customer`);
  };

  const handleShopNow = (sellerId) => {
    localStorage.setItem("sellerId", sellerId);
    window.location.href = `/shop/${sellerId}`;
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <span className="company-name">Give and Take</span>
        </div>

        <div className="header-middle">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search shops or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <div className="header-right">
          <FaBell className="icon notification-icon" onClick={handleNotificationClick} />
          <FaUser className="icon profile-icon" onClick={handleProfileClick} />
        </div>
      </header>

      {/* Shop List */}
      <section className="shops-section">
        <div className="shop-grid">
          {filteredSellers.map((seller) => (
            <div className="shop-card" key={seller._id}>
              <h3>{seller.shopName}</h3>
              <p><strong>Owner:</strong> {seller.sellerName}</p>
              <p><strong>Contact:</strong> {seller.contactNumber}</p>
              <p><strong>Address:</strong> {seller.shopAddress}</p>
              <button className="shop-now-btn" onClick={() => handleShopNow(seller._id)}>
                <FaShoppingCart /> Shop Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
