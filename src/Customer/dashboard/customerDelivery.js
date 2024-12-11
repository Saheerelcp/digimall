import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/deliveryUpdates.css"; // Add custom styles

const CustomerDeliveryUpdates = () => {
  const { customerId } = useParams(); // Extract customerId from URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(`Customer ID: ${customerId}`);

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

  if (loading) return <div>Loading delivery updates...</div>;
  if (error) return <div>Sorry, we couldn't load the delivery updates. Please try again later.</div>;

  const deliveryStatuses = [
    "Order sent to seller",
    "Order ready for delivery",
    "Out for delivery",
    "Delivered successfully",
  ];

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
        <p>
          Expected Delivery:{" "}
          {orderDetails.expectedDelivery
            ? new Date(orderDetails.expectedDelivery).toLocaleDateString()
            : "Not available"}
        </p>
      </div>

      {/* Delivery Timeline */}
      <div className="timeline">
        {deliveryStatuses.map((status, index) => (
          <div
            key={index}
            className={`timeline-item ${
              deliveryStatuses.indexOf(orderDetails.status) >= index ? "active" : ""
            }`}
          >
            <span className="timeline-icon">&#10004;</span>
            <p>{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDeliveryUpdates;
