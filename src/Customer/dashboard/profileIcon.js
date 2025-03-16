import React from 'react';
import '../../styles/profileIcon.css';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa";
import logo from '../../logo-images/logo10-EDIT.jpg';

function ProfileIcon() {
  const navigate = useNavigate();
  const customerId=localStorage.getItem('customerId');
  const handleNavigate = () => {
    navigate(`/customer-profile/${customerId}`); // Navigate to the profile page
  };
  
  return (
    
    <div className="customer-profile">
       <header className="header">
        <div className="logo-block">
          <img
            src={logo}
            alt="Profile"
            className="logo"
          />
        </div>
        <h2 className="profile-title">Give And Take</h2>
        <div className="profile-actions">
          
          <button className="logout-button"> <FaSignOutAlt size={20} /></button>
        </div>
      </header>
      <div className="profile-blocks">
        <div className="block" onClick={() => handleNavigate()}>
          <h2>Order Details</h2>
        </div>
        <div className="block" onClick={() => navigate(`/address-component/${customerId}`)}>
          <h2>Save Address</h2>
        </div>
        <div className="block" onClick={() => navigate('/contact-us')}>
          <h2>Contact Us</h2>
        </div>
      </div>
    </div>
  );
}

export default ProfileIcon;