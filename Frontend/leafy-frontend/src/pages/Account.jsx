import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, LogOut, ShoppingBag, Heart, Package, Home, Sprout } from 'lucide-react';
import '../styles/Account.css';

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!authToken || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditedUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Show confirmation
    alert('You have been logged out successfully!');
    
    // Redirect to home page
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock orders data - Replace with actual API call later
  const mockOrders = [
    {
      id: '12567',
      date: 'October 15, 2023',
      status: 'delivered',
      items: [
        { id: 1, name: 'Monstera Deliciosa', image: '🌿' },
        { id: 2, name: 'Snake Plant', image: '🪴' },
        { id: 3, name: 'ZZ Plant', image: '🌱' }
      ],
      total: 124.50
    },
    {
      id: '12511',
      date: 'October 11, 2023',
      status: 'shipped',
      items: [
        { id: 4, name: 'Pothos', image: '🌿' },
        { id: 5, name: 'Succulent', image: '🌵' }
      ],
      total: 58.00
    },
    {
      id: '12498',
      date: 'October 08, 2023',
      status: 'processing',
      items: [
        { id: 6, name: 'Air Plant', image: '🪴' }
      ],
      total: 32.99
    }
  ];

  const getFilteredOrders = () => {
    if (orderFilter === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === orderFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="account-container">
      <div className="account-wrapper">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <h3 className="profile-name">{user.name || 'User'}</h3>
              <p className="profile-email">{user.email}</p>
            </div>

            <nav className="account-nav">
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={20} />
                <span>My Orders</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <Home size={20} />
                <span>Addresses</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={20} />
                <span>Wishlist</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'garden' ? 'active' : ''}`}
                onClick={() => setActiveTab('garden')}
              >
                <Sprout size={20} />
                <span>My Garden</span>
              </button>
            </nav>

            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="account-main">
            {activeTab === 'orders' && (
              <div className="content-section">
                <div className="section-header-simple">
                  <h2>My Orders</h2>
                </div>

                {/* Order Filter Tabs */}
                <div className="order-filters">
                  <button
                    className={`filter-btn ${orderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'processing' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('processing')}
                  >
                    Processing
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'shipped' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('shipped')}
                  >
                    Shipped
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('delivered')}
                  >
                    Delivered
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('cancelled')}
                  >
                    Cancelled
                  </button>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                  {getFilteredOrders().length > 0 ? (
                    getFilteredOrders().map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">{order.date}</p>
                          </div>
                          <span className={`order-status ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="order-body">
                          <div className="order-items">
                            {order.items.map((item) => (
                              <div key={item.id} className="order-item-thumb">
                                <span className="item-emoji">{item.image}</span>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>Total</span>
                              <h4>${order.total.toFixed(2)}</h4>
                            </div>
                            <button className="btn-track">
                              {order.status === 'delivered' ? 'Track Order' : 
                               order.status === 'processing' ? 'View Details' : 'Track Order'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <ShoppingBag size={64} />
                      <h3>No orders found</h3>
                      <p>No orders match the selected filter.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  {!isEditing ? (
                    <button className="btn-edit" onClick={handleEdit}>
                      <Edit2 size={18} />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button className="btn-save" onClick={handleSave}>
                        <Save size={18} />
                        <span>Save</span>
                      </button>
                      <button className="btn-cancel" onClick={handleCancel}>
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <div className="detail-label">
                        <User size={18} />
                        <span>Full Name</span>
                      </div>
                      {!isEditing ? (
                        <div className="detail-value">{user.name || 'Not provided'}</div>
                      ) : (
                        <input
                          type="text"
                          name="name"
                          value={editedUser.name || ''}
                          onChange={handleInputChange}
                          className="detail-input"
                          placeholder="Enter your name"
                        />
                      )}
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">
                        <Mail size={18} />
                        <span>Email Address</span>
                      </div>
                      <div className="detail-value">{user.email}</div>
                      {isEditing && <small className="detail-note">Email cannot be changed</small>}
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">
                        <Phone size={18} />
                        <span>Phone Number</span>
                      </div>
                      {!isEditing ? (
                        <div className="detail-value">{user.phone || 'Not provided'}</div>
                      ) : (
                        <input
                          type="tel"
                          name="phone"
                          value={editedUser.phone || ''}
                          onChange={handleInputChange}
                          className="detail-input"
                          placeholder="Enter phone number"
                        />
                      )}
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">
                        <MapPin size={18} />
                        <span>Address</span>
                      </div>
                      {!isEditing ? (
                        <div className="detail-value">{user.address || 'Not provided'}</div>
                      ) : (
                        <textarea
                          name="address"
                          value={editedUser.address || ''}
                          onChange={handleInputChange}
                          className="detail-textarea"
                          placeholder="Enter your address"
                          rows="3"
                        />
                      )}
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">
                        <Calendar size={18} />
                        <span>Member Since</span>
                      </div>
                      <div className="detail-value">{formatDate(user.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="account-stats">
                  <div className="stat-card">
                    <ShoppingBag size={24} />
                    <div className="stat-content">
                      <h4>0</h4>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Heart size={24} />
                    <div className="stat-content">
                      <h4>0</h4>
                      <p>Wishlist Items</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="content-section">
                <div className="section-header">
                  <h2>My Addresses</h2>
                  <button className="btn-edit">
                    <Edit2 size={18} />
                    <span>Add New Address</span>
                  </button>
                </div>
                <div className="empty-state">
                  <MapPin size={64} />
                  <h3>No saved addresses</h3>
                  <p>Add your delivery addresses for faster checkout.</p>
                  <button className="btn-primary">
                    Add Address
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="content-section">
                <div className="section-header-simple">
                  <h2>My Wishlist</h2>
                </div>
                <div className="empty-state">
                  <Heart size={64} />
                  <h3>No items in wishlist</h3>
                  <p>Save your favorite plants to your wishlist for later.</p>
                  <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Browse Plants
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'garden' && (
              <div className="content-section">
                <div className="section-header-simple">
                  <h2>My Garden</h2>
                </div>
                <div className="empty-state">
                  <Sprout size={64} />
                  <h3>Your garden is empty</h3>
                  <p>Track and manage your plant collection here.</p>
                  <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Add Plants
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
  
  export default Account;