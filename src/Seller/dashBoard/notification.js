import React, { useState, useEffect } from "react";
import "../../styles/notification.css"; // Import the CSS file

const NotificationPage = () => {
    const sellerId = localStorage.getItem("sellerId"); // Ensure sellerId is available
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sellerId) return;

        // Fetch notifications from backend
        fetch(`http://localhost:5129/api/notifications/${sellerId}`)
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching notifications:", err);
                setLoading(false);
            });

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
