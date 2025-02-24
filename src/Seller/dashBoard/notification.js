import React, { useState, useEffect } from "react";
import "../../styles/notification.css"; // Import the CSS file

const NotificationPage = () => {
    const sellerId = localStorage.getItem("sellerId"); // Ensure sellerId is available
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sellerId) return;

        // Function to check stock alerts before fetching notifications
        const checkStockAlerts = async () => {
            try {
                await fetch(`http://localhost:5129/api/check-stock-alerts?sellerId=${sellerId}`, {
                    method: "GET",
                });
            } catch (error) {
                console.error("Error checking stock alerts:", error);
            }
        };

        // Function to fetch notifications from backend
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`http://localhost:5129/api/notifications/${sellerId}`);
                const data = await res.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        // Run both functions
        checkStockAlerts().then(fetchNotifications);

    }, [sellerId]);

    // Function to mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:5129/api/notifications/read`, {
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
        <div className="notification-container">
            <h2 className="notification-title">📢 Notifications</h2>

            {loading ? (
                <p className="notification-message">Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <p className="notification-message">No notifications yet.</p>
            ) : (
                <ul className="notification-list">
                    {notifications.map((notif) => (
                        <li
                            key={notif._id}
                            className={`notification-item ${notif.read ? "read" : "unread"}`}
                            onClick={() => markAsRead(notif._id)}
                        >
                            <span className="notification-text">{notif.message}</span>
                            <span className="notification-timestamp">
                                {new Date(notif.timestamp).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationPage;
