import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/deliveryUpdates.css"; // Add custom styles

const CustomerDeliveryUpdates = () => {
  const { customerId } = useParams(); // Extract customerId from URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    console.log(`what is customerId:${customerId}`);
  useEffect(() => {
    // Fetch delivery updates using customerId
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/delivery-updates/${customerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch delivery updates");
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchOrderDetails();
    }
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="delivery-updates-container">
      {/* Bill Button */}
      {orderDetails.billUrl && (
        <div className="bill-button-container">
          <a href={orderDetails.billUrl} target="_blank" rel="noopener noreferrer">
            <button className="bill-button">Download Bill</button>
          </a>
        </div>
      )}

      {/* Order Details */}
      <div className="order-details-header">
        <h2>Delivery Updates</h2>
        <p>Customer ID: {customerId}</p>
        <p>Expected Delivery: {new Date(orderDetails.expectedDelivery).toLocaleDateString()}</p>
      </div>

      {/* Delivery Timeline */}
      <div className="timeline">
        <div className={`timeline-item ${orderDetails.status === "Order sent to seller" ? "active" : ""}`}>
          <span className="timeline-icon">&#10004;</span>
          <p>Order sent to seller</p>
        </div>
        <div className={`timeline-item ${orderDetails.status === "Order ready for delivery" ? "active" : ""}`}>
          <span className="timeline-icon">&#10004;</span>
          <p>Order ready for delivery</p>
        </div>
        <div className={`timeline-item ${orderDetails.status === "Out for delivery" ? "active" : ""}`}>
          <span className="timeline-icon">&#10004;</span>
          <p>Out for delivery</p>
        </div>
        <div className={`timeline-item ${orderDetails.status === "Delivered successfully" ? "active" : ""}`}>
          <span className="timeline-icon">&#10004;</span>
          <p>Delivered successfully</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeliveryUpdates;
