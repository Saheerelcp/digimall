import React, { useState, useEffect } from "react";
import "../../styles/customerNotification.css";

const CustomerNotificationPage = () => {
  const customerId = localStorage.getItem("customerId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5129/api/customer/notifications/${customerId}`);
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [customerId]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5129/api/customer/notifications/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="customer-notification-container">
      <h2 className="customer-notification-title">🚚 Delivery Updates</h2>

      {loading ? (
        <p className="customer-notification-message">Loading updates...</p>
      ) : notifications.length === 0 ? (
        <p className="customer-notification-message">No updates available.</p>
      ) : (
        <ul className="customer-notification-list">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`customer-notification-item ${notif.read ? "read" : "unread"}`}
              onClick={() => markAsRead(notif._id)}
            >
              <div className="notification-content">
                <span className="notification-icon">
                  {notif.type === 'delivery' ? '🚚' : '📦'}
                </span>
                <div className="notification-details">
                  <span className="notification-text">{notif.message}</span>
                  <span className="notification-timestamp">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerNotificationPage;