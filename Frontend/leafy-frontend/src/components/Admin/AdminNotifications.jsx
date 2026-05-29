import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  Trash2,
  CheckCheck,
  RefreshCw,
  Filter,
} from 'lucide-react';
import '../../styles/AdminNotifications.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/notifications`;

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('authToken');
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchStats();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?filter=${filter}&page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE}/unread/count`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showNotification = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
        // showNotification('✅ Notification marked as read', 'success');
        showNotification('Notification marked as read', 'success');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showNotification('Error marking notification as read', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/all/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
        // showNotification(`✅ ${data.updated} notifications marked as read`, 'success');
        showNotification(`${data.updated} notifications marked as read`, 'success');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      showNotification('Error marking notifications as read', 'error');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
        showNotification('✅ Notification deleted', 'success');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      showNotification('Error deleting notification', 'error');
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/all`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchNotifications();
        showNotification(`✅ ${data.deleted} notifications deleted`, 'success');
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      showNotification('Error deleting notifications', 'error');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_placed':
        return '🛒';
      case 'order_updated':
        return '📝';
      case 'order_cancelled':
        return '❌';
      case 'order_delivered':
        return '✅';
      case 'system_alert':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'priority-critical';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now - notifDate;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return notifDate.toLocaleDateString();
  };

  return (
    <div className="admin-notifications">
      {/* Notification Alert */}
      {message && (
        <div className={`notifications-alert ${messageType}`}>
          {messageType === 'success' ? '✅' : '⚠️'}
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <div className="notifications-header">
        <div className="notifications-title">
          <Bell size={28} /> {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          <h1>Notifications </h1>
        </div>

        <div className="notifications-actions">
          <button
            className="notification-btn refresh-btn"
            onClick={() => {
              fetchNotifications();
              fetchUnreadCount();
              fetchStats();
            }}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

          {unreadCount > 0 && (
            <button
              className="notification-btn mark-all-read"
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              className="notification-btn delete-all-btn"
              onClick={deleteAllNotifications}
              title="Delete all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="notifications-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalCount}</div>
            <div className="stat-label">Total</div>
          </div>
          {stats.byPriority && stats.byPriority.length > 0 && (
            <div className="stat-item">
              <div className="stat-number">
                {stats.byPriority.find((s) => s._id === 'critical')?.count || 0}
              </div>
              <div className="stat-label">Urgent</div>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      <div className="notifications-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => {
            setFilter('all');
            setPage(1);
          }}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => {
            setFilter('unread');
            setPage(1);
          }}
        >
          Unread
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => {
            setFilter('read');
            setPage(1);
          }}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {loading ? (
          <div className="notifications-loading">
            <div className="loader"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getPriorityColor(
                  notification.priority
                )}`}
              >
                <div className="notification-icon">{getNotificationIcon(notification.type)}</div>

                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-type">{notification.type.replace('_', ' ')}</span>
                    <span className="notification-time">{formatDate(notification.createdAt)}</span>
                  </div>
                </div>

                <div className="notification-priority">
                  <span className={`priority-badge ${notification.priority}`}>
                    {notification.priority.toUpperCase()}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      className="action-btn mark-read"
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="notifications-empty">
            <Bell size={48} />
            <p>No notifications</p>
            <small>
              {filter === 'unread'
                ? 'You are all caught up!'
                : 'You have no notifications yet.'}
            </small>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="notifications-pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>

          <div className="pagination-info">
            Page {page} of {totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
