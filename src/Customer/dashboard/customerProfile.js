import React, { useEffect, useState } from "react";
import "../../styles/customerProfile.css";

const CustomerProfile = () => {
  const [deliveryUpdates, setDeliveryUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch delivery updates for the customer
    const fetchDeliveryUpdates = async () => {
      const customerId = localStorage.getItem("customerId");
      try {
        const response = await fetch(`http://localhost:5129/api/customer/delivery-updates/${customerId}`);
        const data = await response.json();
        console.log(data.orders.orderId);
        
        if (response.ok) {
          // Update state with fetched orders, including default values for missing fields
          const updatedOrders = data.orders.map((order) => ({
            ...order,
            status: order.status || "Sent to Seller",
            expectedDelivery: order.expectedDelivery || "Wait for Seller Response",
          }));
          setDeliveryUpdates(updatedOrders);
        } else {
          alert(data.message || "Failed to fetch delivery updates.");
        }
      } catch (error) {
        console.error("Error fetching delivery updates:", error);
        alert("An error occurred while fetching delivery updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryUpdates(); // Fetch updates on component mount
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="customer-profile-container">
      <header className="profile-header">
        <div className="profile-icon">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="profile-avatar"
          />
        </div>
        <div className="profile-actions">
          <button>Settings</button>
          <button>Logout</button>
        </div>
      </header>

      <div className="delivery-updates">
        <h2>Delivery Updates</h2>
        {deliveryUpdates.length > 0 ? (
          <div className="updates-list">
            {deliveryUpdates.map((update) => (
              <div key={update._id} className="update-item">
                <p><strong>Order ID:</strong> {update.orderId}</p>
                <p><strong>Status:</strong> {update.status}</p>
                <p><strong>Shop:</strong> {update.shopName}</p>
                <p><strong>Contact Number:</strong> {update.contactNumber || "Not Available"}</p>
                <p><strong>Expected Delivery:</strong> {update.expectedDelivery}</p>
                <button onClick={() => handleViewDetails(update._id)}>View Details</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No delivery updates available.</p>
        )}
      </div>
    </div>
  );
};

// Placeholder for handling view details (e.g., show a modal or navigate to details page)
const handleViewDetails = (orderId) => {
  alert(`Viewing details for Order ID: ${orderId}`);
};

export default CustomerProfile;
