import React from 'react';
import { FaUserCircle, FaCartPlus, FaReceipt, FaMoneyBillWave, FaBell, FaChartBar, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/sellerDashboard.css';
import logo from '../logo-images/logo10-EDIT.jpg';
import watch from '../logo-images/watch.jpg'
import juice from '../logo-images/juice.jpg'
import toner from '../logo-images/toner.jpg'
import sunscreen from '../logo-images/sunscreen.jpg'
import biscuit from '../logo-images/biscuit.jpg'
import spray from '../logo-images/spray.jpg'

const SellerDashboard = () => {
  const navigate = useNavigate();
  const handleAddProductsClick = () => navigate('/product-categories');
  const sellerId = localStorage.getItem("sellerId");
  const handleCustomerBill = () => navigate(`/seller-bill/${sellerId}`);
  const handleBudget = () => navigate('/budget-section');
  const handleAvailability = () => navigate('/availability-section');
  const handleOffer = () => navigate('/offer-section');
  const handleNotifications = () => navigate('/notification-page');
  const handleProfile = () => navigate("/seller-profile");

  // Cover Page Slider Component
  const CoverPageSlider = () => {
    
      const images = [watch, juice, toner, sunscreen, biscuit, spray];

      
  

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 768,
          settings: { slidesToShow: 2 }
        },
        {
          breakpoint: 480,
          settings: { slidesToShow: 1 }
        }
      ]
    };

    return (
      <div className="coverpage-slider">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="image-slide">
              <img src={img} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} className='logo-icon'></img>
        <h1>Give and Take</h1>
        <button className='profile-button' onClick={handleProfile}>
          <FaUserCircle className="profile-icon" />
        </button>
      </header>

      <div className="coverpage-space">
        <CoverPageSlider />
      </div>

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
        <button className="dashboard-button" onClick={handleNotifications}>
          <FaBell className="button-icon" />
          Notifications
        </button>
        <button className="dashboard-button" onClick={handleAvailability}>
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
