import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaCartPlus, FaReceipt, FaMoneyBillWave, FaBell, FaChartBar, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/sellerDashboard.css';


const SellerDashboard = () => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();
  const handleAddProductsClick = () => {
    navigate('/product-categories');
  };
  const sellerId=localStorage.getItem("sellerId");
  const handleCustomerBill = () => {
    navigate(`/seller-bill/${sellerId}`);
  }
  const handleBudget = () => {
    navigate('/budget-section');
  }
  const handleAvailibility = () => {
    navigate(`/availability-section`);
  }
  const handleOffer = () =>{
    navigate('/offer-section');
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 2000); // Popup disappears after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {showPopup && (
        <div className="popup">
          <p>Congratulations, welcome to E-Shop!</p>
        </div>
      )}

      <header className="dashboard-header">
        <h1>E-Shop Dashboard</h1>
        <FaUserCircle className="profile-icon" />
      </header>

      <div className="coverpage-space"></div>

      <div className="button-grid">
        <button className="dashboard-button" onClick={handleAddProductsClick}>
          <FaCartPlus className="button-icon" />
          Add Products
        </button>
        <button className="dashboard-button" onClick={handleCustomerBill}>
          <FaReceipt className="button-icon" /> 
          Customer Bill
        </button>
        <button className="dashboard-button" onClick={handleBudget}>
          <FaMoneyBillWave className="button-icon" />
          Budget
        </button>
        <button className="dashboard-button">
          <FaBell className="button-icon" />
          Notifications
        </button>
        <button className="dashboard-button" onClick={handleAvailibility}>
          <FaChartBar className="button-icon" />
          Availability
        </button>
        <button className="dashboard-button" onClick={handleOffer}>
          <FaGift className="button-icon" />
          Offers
        </button>
      </div>
    </div>
  );

};

export default SellerDashboard;
