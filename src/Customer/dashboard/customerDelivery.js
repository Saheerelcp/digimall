import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/deliveryUpdates.css"; // Add custom styles if needed

const CustomerDeliveryUpdates = () => {
  const navigate = useNavigate();
  const customerId=localStorage.getItem('customerId');
  const handleNavigate = () => {
    navigate(`/customer-profile/${customerId}`); // Navigate to the profile page
  };

  return (
    <div className="delivery-updates-container">
      <div className="message-box">
        <h2>Your Order has been sent to the seller.</h2>
        <p>For further updates, please check on your profile page.</p>
        <button className="navigate-button" onClick={handleNavigate}>
          Go to Profile
        </button>
      </div>
    </div>
  );
};

export default CustomerDeliveryUpdates;
