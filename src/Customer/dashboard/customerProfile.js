import React, { useEffect, useState } from "react";
import "../../styles/customerProfile.css";
import { FaTimes } from "react-icons/fa"; // Close icon

const CustomerProfile = () => {
  const [deliveryUpdates, setDeliveryUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For pop-up modal
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  useEffect(() => {
    const fetchDeliveryUpdates = async () => {
      const customerId = localStorage.getItem("customerId");
      try {
        const response = await fetch(`http://localhost:5129/api/customer/delivery-updates/${customerId}`);
        const data = await response.json();

        if (response.ok) {
          const updatedOrders = data.orders.map((order) => ({
            ...order,
            status: order.status || "Sent to Seller",
            orderDate:order.orderDate? new Date(order.orderDate).toISOString() : null,

            expectedDelivery: order.expectedDelivery || "Wait for Seller Response",
          }));
          setDeliveryUpdates(updatedOrders);
          console.log(updatedOrders.expectedDelivery);
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

    fetchDeliveryUpdates();
  }, []);
  const sortedUpdates = [...deliveryUpdates].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );
  const handleViewDetails = async (orderId) => {
    const customerId = localStorage.getItem("customerId"); 
    try {
      const response = await fetch(`http://localhost:5129/api/customer/order-details/${customerId}/${orderId}`);
      const data = await response.json();
      
      console.log("Fetched Order Data:", data); // Debugging
  
      if (response.ok) {
        setSelectedOrder(data.order); // Ensure correct data is stored
        setShowModal(true);
      } else {
        alert("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("An error occurred while fetching order details.");
    }
  };
  
  const closePopup = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="customer-profile-container">
      <div className="delivery-updates">
        <h3>Delivery Updates</h3>
        {sortedUpdates.length > 0 ? (
          <div className="updates-list">
            {sortedUpdates.map((update) => (
              <div key={update._id} className="update-item">
                <p><strong>Order ID:</strong> {update.orderId}</p>
                <p><strong>Status:</strong> {update.status}</p>
                <p><strong>Shop:</strong> {update.shopName}</p>
                <button className="view-details-btn" onClick={() => handleViewDetails(update._id)}>
                  View Bill
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No delivery updates available.</p>
        )}
      </div>

      {/* Order Bill Popup Modal (Centered) */}
      {showModal && selectedOrder && (
        <div className="modal-content">
          <button className="close-buttons" onClick={closePopup}>
            <FaTimes size={20} />
          </button>
          <h2>Order Bill</h2>
          <ul>
            {selectedOrder.items.map((item, index) => (
              <li key={index}>
                {item.productName} - ₹{item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p className="total-price"><strong>Total Price:</strong> ₹{selectedOrder.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
