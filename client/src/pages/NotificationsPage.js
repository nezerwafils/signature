import React, { useState, useEffect } from 'react';
import { interactionAPI } from '../services/api';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await interactionAPI.getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await interactionAPI.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getNotificationMessage = (notification) => {
    const senderName = notification.sender?.displayName || notification.sender?.username || 'Someone';
    switch (notification.type) {
      case 'follow':
        return `${senderName} started following you`;
      case 'like':
        return `${senderName} liked your post`;
      case 'comment':
        return `${senderName} commented on your post`;
      case 'share':
        return `${senderName} shared your post`;
      default:
        return 'New notification';
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <h1 className="page-title">Notifications</h1>
          {notifications.length > 0 && (
            <button onClick={handleMarkAllRead} className="btn btn-secondary">
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M32 8a24 24 0 00-24 24v14.344l-2.828 2.828A4 4 0 008 56h48a4 4 0 002.828-6.828L56 46.344V32a24 24 0 00-24-24zM32 60a12 12 0 01-12-12h24a12 12 0 01-12 12z" fill="currentColor" opacity="0.2"/>
              </svg>
              <h3>No notifications yet</h3>
              <p>When people interact with your content, you'll see it here</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-avatar">
                  {notification.sender?.avatar ? (
                    <img src={notification.sender.avatar} alt="" />
                  ) : (
                    <span>{notification.sender?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="notification-content">
                  <p className="notification-message">
                    {getNotificationMessage(notification)}
                  </p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
