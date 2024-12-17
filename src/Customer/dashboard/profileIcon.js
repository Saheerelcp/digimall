import React from 'react';
import '../../styles/profileIcon.css';
import { useNavigate } from 'react-router-dom';

function ProfileIcon() {
  const navigate = useNavigate();
  const customerId=localStorage.getItem('customerId');
  const handleNavigate = () => {
    navigate(`/customer-profile/${customerId}`); // Navigate to the profile page
  };
  
  return (
    <div className="customer-profile">
      <h1 className="profile-heading">Customer Options</h1>
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