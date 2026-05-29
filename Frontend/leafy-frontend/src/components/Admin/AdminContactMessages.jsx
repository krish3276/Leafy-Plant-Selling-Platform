import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Check, Eye } from 'lucide-react';
import './AdminContactMessages.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/contact`;

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [filter, page]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const url = `${API_BASE}?filter=${filter}&page=${page}&limit=10`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/${messageId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSelectedMessage(data.message);
      }
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-contact-messages">
      {/* Header */}
      <div className="contact-header">
        <h1>Contact Messages</h1>
        <div className="contact-stats">
          <span>{messages.length} message(s)</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="contact-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setPage(1); }}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
          onClick={() => { setFilter('new'); setPage(1); }}
        >
          New
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => { setFilter('read'); setPage(1); }}
        >
          Read
        </button>
        <button
          className={`filter-btn ${filter === 'responded' ? 'active' : ''}`}
          onClick={() => { setFilter('responded'); setPage(1); }}
        >
          Responded
        </button>
      </div>

      <div className="contact-content">
        {/* Messages List */}
        <div className="contact-list">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} />
              <p>No messages found</p>
            </div>
          ) : (
            <>
              <div className="messages-table">
                <div className="table-header">
                  <div className="col-status">Status</div>
                  <div className="col-name">Name</div>
                  <div className="col-subject">Subject</div>
                  <div className="col-email">Email</div>
                  <div className="col-date">Date</div>
                  <div className="col-actions">Actions</div>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`table-row ${msg.status}`}
                  >
                    <div className="col-status">
                      <span className={`status-badge ${msg.status}`}>
                        {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                      </span>
                    </div>
                    <div className="col-name">{msg.name}</div>
                    <div className="col-subject">{msg.subject}</div>
                    <div className="col-email">{msg.email}</div>
                    <div className="col-date">{formatDate(msg.createdAt)}</div>
                    <div className="col-actions">
                      <button
                        className="action-btn view"
                        title="View message"
                        onClick={() => handleViewMessage(msg._id)}
                      >
                        <Eye size={16} />
                      </button>
                      {msg.status === 'new' && (
                        <button
                          className="action-btn mark-read"
                          title="Mark as read"
                          onClick={() => handleMarkAsRead(msg._id)}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        title="Delete message"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    ← Previous
                  </button>
                  <span>Page {page} of {totalPages}</span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Message Detail */}
        {selectedMessage && (
          <div className="message-detail">
            <div className="detail-header">
              <h2>Message Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedMessage(null)}
              >
                ×
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-row">
                <label>From:</label>
                <p>{selectedMessage.name}</p>
              </div>

              <div className="detail-row">
                <label>Email:</label>
                <p>
                  <a href={`mailto:${selectedMessage.email}`}>
                    {selectedMessage.email}
                  </a>
                </p>
              </div>

              {selectedMessage.phone && (
                <div className="detail-row">
                  <label>Phone:</label>
                  <p>{selectedMessage.phone}</p>
                </div>
              )}

              <div className="detail-row">
                <label>Subject:</label>
                <p>{selectedMessage.subject}</p>
              </div>

              <div className="detail-row">
                <label>Date:</label>
                <p>{formatDate(selectedMessage.createdAt)}</p>
              </div>

              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${selectedMessage.status}`}>
                  {selectedMessage.status.charAt(0).toUpperCase() +
                    selectedMessage.status.slice(1)}
                </span>
              </div>

              <div className="detail-row full-width">
                <label>Message:</label>
                <div className="message-text">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.adminNotes && (
                <div className="detail-row full-width">
                  <label>Admin Notes:</label>
                  <div className="admin-notes">
                    {selectedMessage.adminNotes}
                  </div>
                </div>
              )}

              <div className="detail-actions">
                {selectedMessage.status === 'new' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage._id);
                      setSelectedMessage(null);
                    }}
                  >
                    <Check size={16} /> Mark as Read
                  </button>
                )}
                <button
                  className="btn-danger"
                  onClick={() => {
                    handleDeleteMessage(selectedMessage._id);
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContactMessages;
