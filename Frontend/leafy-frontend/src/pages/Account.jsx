import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, LogOut, ShoppingBag, Heart, Package, Home, Sprout } from 'lucide-react';
import { authAPI, orderAPI, gardenAPI } from '../utils/api';
import '../styles/Account.css';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = (value) => priceFormatter.format(Number(value || 0));

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [gardenPlants, setGardenPlants] = useState([]);
  const [gardenSummary, setGardenSummary] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    attentionPlants: 0,
    reminderCount: 0,
  });
  const [gardenReminders, setGardenReminders] = useState([]);
  const [gardenLoading, setGardenLoading] = useState(false);
  const [gardenError, setGardenError] = useState('');
  const [gardenMessage, setGardenMessage] = useState('');
  const [selectedGardenPlant, setSelectedGardenPlant] = useState(null);
  const [gardenNoteDraft, setGardenNoteDraft] = useState('');
  const [gardenActionLoading, setGardenActionLoading] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelResult, setCancelResult] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    const refreshAccountData = async () => {
      try {
        const profileResponse = await authAPI.getProfile();

        if (profileResponse.success && profileResponse.user) {
          const normalizedUser = {
            ...profileResponse.user,
            name: `${profileResponse.user.firstName || ''} ${profileResponse.user.lastName || ''}`.trim(),
          };

          setUser(normalizedUser);
          setEditedUser(normalizedUser);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        }

        const [ordersResult, gardenResult] = await Promise.allSettled([
          orderAPI.getMyOrders(),
          gardenAPI.getGarden(),
        ]);

        if (ordersResult.status === 'fulfilled') {
          setOrders(ordersResult.value.orders || []);
          setOrdersError('');
        } else {
          console.error('Error loading orders:', ordersResult.reason);
          setOrders([]);
          setOrdersError('Failed to load your orders.');
        }

        if (gardenResult.status === 'fulfilled') {
          setGardenPlants(gardenResult.value.gardenPlants || []);
          setGardenSummary(gardenResult.value.summary || {
            totalPlants: 0,
            healthyPlants: 0,
            attentionPlants: 0,
            reminderCount: 0,
          });
          setGardenReminders(gardenResult.value.reminders || []);
          setGardenError('');
        } else {
          console.error('Error loading garden:', gardenResult.reason);
          setGardenPlants([]);
          setGardenReminders([]);
          setGardenError('Failed to load your garden.');
        }
      } catch (error) {
        console.error('Error refreshing account data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setOrdersLoading(false);
        setGardenLoading(false);
      }
    };

    setOrdersLoading(true);
    setGardenLoading(true);
    setOrdersError('');
    setGardenError('');
    refreshAccountData();
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
        const updatedUser = {
          ...data.user,
          wishlist: user.wishlist || [],
          name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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

  const getFilteredOrders = () => {
    if (orderFilter === 'all') return orders;
    return orders.filter((order) => order.orderStatus === orderFilter);
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
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTrackingLabel = (status) => {
    switch (status) {
      case 'delivered':
        return 'Track Order';
      case 'processing':
        return 'View Details';
      case 'shipped':
        return 'Track Order';
      case 'confirmed':
        return 'Track Order';
      case 'cancelled':
        return 'View Details';
      default:
        return 'Track Order';
    }
  };

  const openTrackingModal = async (order) => {
    try {
      setTrackingOrderId(order._id);
      setTrackingLoading(true);
      setTrackingError('');
      setTrackingData(null);

      const response = await orderAPI.trackOrder(order._id);
      setTrackingData(response.tracking);
    } catch (error) {
      console.error('Error loading tracking details:', error);
      setTrackingError(error.message || 'Failed to load tracking details.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const closeTrackingModal = () => {
    setTrackingOrderId(null);
    setTrackingLoading(false);
    setTrackingError('');
    setTrackingData(null);
  };

  const openCancelModal = (order) => {
    setCancelOrderId(order._id);
    setCancelError('');
    setCancelResult(null);
    setShowCancelConfirm(true);
  };

  const closeCancelModal = () => {
    setCancelOrderId(null);
    setCancelLoading(false);
    setCancelError('');
    setCancelResult(null);
    setShowCancelConfirm(false);
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;

    try {
      setCancelLoading(true);
      setCancelError('');
      setCancelResult(null);
      setShowCancelConfirm(false);

      const response = await orderAPI.cancelOrder(cancelOrderId);

      if (response.success) {
        setCancelResult(response);
        // Update the orders list
        await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay for UX
        
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === cancelOrderId
              ? { ...order, orderStatus: 'cancelled', paymentStatus: response.order?.paymentStatus }
              : order
          )
        );
      } else {
        setCancelError(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setCancelError(error.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatTrackingDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatGardenDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGardenHealthClass = (status) => {
    switch (status) {
      case 'healthy':
        return 'health-healthy';
      case 'needs_water':
        return 'health-needs-water';
      case 'pest_warning':
        return 'health-pest-warning';
      case 'low_light':
        return 'health-low-light';
      default:
        return '';
    }
  };

  const getReminderLabel = (reminder) => {
    if (reminder?.isOverdue) {
      return `Overdue by ${Math.abs(reminder.daysRemaining)} day${Math.abs(reminder.daysRemaining) === 1 ? '' : 's'}`;
    }

    if (reminder?.daysRemaining === 0) {
      return 'Due today';
    }

    return `Due in ${reminder?.daysRemaining || 0} day${reminder?.daysRemaining === 1 ? '' : 's'}`;
  };

  const refreshGardenData = async () => {
    try {
      setGardenLoading(true);
      const response = await gardenAPI.getGarden();
      setGardenPlants(response.gardenPlants || []);
      setGardenSummary(response.summary || gardenSummary);
      setGardenReminders(response.reminders || []);
      setGardenError('');
    } catch (error) {
      console.error('Error refreshing garden:', error);
      setGardenError('Failed to load your garden.');
    } finally {
      setGardenLoading(false);
    }
  };

  const refreshWishlistAndGarden = async () => {
    try {
      const [profileResponse, gardenResponse] = await Promise.all([
        authAPI.getProfile(),
        gardenAPI.getGarden(),
      ]);

      if (profileResponse.success && profileResponse.user) {
        const normalizedUser = {
          ...profileResponse.user,
          name: `${profileResponse.user.firstName || ''} ${profileResponse.user.lastName || ''}`.trim(),
        };

        setUser(normalizedUser);
        setEditedUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }

      setGardenPlants(gardenResponse.gardenPlants || []);
      setGardenSummary(gardenResponse.summary || gardenSummary);
      setGardenReminders(gardenResponse.reminders || []);
    } catch (error) {
      console.error('Error refreshing wishlist and garden:', error);
      await refreshGardenData();
    }
  };

  const handleMoveWishlistToGarden = async (productId) => {
    try {
      setGardenMessage('');
      await gardenAPI.moveWishlistToGarden(productId);
      setGardenMessage('Plant moved to garden successfully.');
      await refreshWishlistAndGarden();
      setTimeout(() => setGardenMessage(''), 3000);
    } catch (error) {
      console.error('Move to garden error:', error);
      setGardenError(error.message || 'Failed to move plant to garden.');
    }
  };

  const openGardenPlant = (plant) => {
    setSelectedGardenPlant(plant);
    setGardenNoteDraft('');
    setGardenMessage('');
  };

  const closeGardenPlant = () => {
    setSelectedGardenPlant(null);
    setGardenNoteDraft('');
  };

  const handleGardenAction = async (action) => {
    if (!selectedGardenPlant) return;

    try {
      setGardenActionLoading(true);
      await gardenAPI.logCareAction(selectedGardenPlant._id, action);
      setGardenMessage('Plant care updated successfully.');
      await refreshGardenData();
      setTimeout(() => setGardenMessage(''), 3000);
    } catch (error) {
      console.error('Garden action error:', error);
      setGardenError(error.message || 'Failed to update plant care.');
    } finally {
      setGardenActionLoading(false);
    }
  };

  const handleGardenHealthChange = async (status) => {
    if (!selectedGardenPlant) return;

    try {
      setGardenActionLoading(true);
      await gardenAPI.updateGardenPlant(selectedGardenPlant._id, { healthStatus: status });
      setGardenMessage('Health status updated.');
      await refreshGardenData();
      setTimeout(() => setGardenMessage(''), 3000);
    } catch (error) {
      console.error('Health update error:', error);
      setGardenError(error.message || 'Failed to update health status.');
    } finally {
      setGardenActionLoading(false);
    }
  };

  const handleAddGardenNote = async () => {
    if (!selectedGardenPlant || !gardenNoteDraft.trim()) return;

    try {
      setGardenActionLoading(true);
      await gardenAPI.addNote(selectedGardenPlant._id, gardenNoteDraft);
      setGardenNoteDraft('');
      setGardenMessage('Note added to journal.');
      await refreshGardenData();
      setTimeout(() => setGardenMessage(''), 3000);
    } catch (error) {
      console.error('Add garden note error:', error);
      setGardenError(error.message || 'Failed to add note.');
    } finally {
      setGardenActionLoading(false);
    }
  };

  const wishlistItems = user.wishlist || [];

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
                  {ordersLoading ? (
                    <div className="empty-state">
                      <ShoppingBag size={64} />
                      <h3>Loading orders...</h3>
                      <p>Please wait while we fetch your order history.</p>
                    </div>
                  ) : ordersError ? (
                    <div className="empty-state">
                      <ShoppingBag size={64} />
                      <h3>Unable to load orders</h3>
                      <p>{ordersError}</p>
                    </div>
                  ) : getFilteredOrders().length > 0 ? (
                    getFilteredOrders().map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order.orderNumber}</h3>
                            <p className="order-date">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                            {getStatusText(order.orderStatus)}
                          </span>
                        </div>

                        <div className="order-body">
                          <div className="order-items">
                            {order.items.map((item) => (
                              <div key={item._id || item.product?._id || item.name} className="order-item-thumb">
                                {item.image || item.product?.image ? (
                                  <img
                                    className="order-item-image"
                                    src={item.image || item.product?.image}
                                    alt={item.name || item.product?.name || 'Order item'}
                                  />
                                ) : (
                                  <span className="item-emoji">🌿</span>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>Total</span>
                              <h4>{formatPrice(order.total)}</h4>
                            </div>
                            <div className="order-buttons">
                              <button className="btn-track" onClick={() => openTrackingModal(order)}>
                                {getTrackingLabel(order.orderStatus)}
                              </button>
                              {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                                <button className="btn-cancel" onClick={() => openCancelModal(order)}>
                                  Cancel Order
                                </button>
                              )}
                            </div>
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
                      <h4>{orders.length}</h4>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Heart size={24} />
                    <div className="stat-content">
                      <h4>{wishlistItems.length}</h4>
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
                {wishlistItems.length > 0 ? (
                  <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                      <div key={item._id} className="wishlist-card">
                        <div className="wishlist-image-wrap">
                          <img src={item.image} alt={item.name} className="wishlist-image" />
                        </div>
                        <div className="wishlist-content">
                          <span className="wishlist-category">{item.category}</span>
                          <h3>{item.name}</h3>
                          <div className="wishlist-meta">
                            <span>{formatPrice(item.price)}</span>
                            <span>{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</span>
                          </div>
                          <div className="wishlist-actions">
                            <button className="btn-primary" onClick={() => navigate(`/product/${item._id}`)}>
                              View Product
                            </button>
                            <button className="btn-secondary" onClick={() => handleMoveWishlistToGarden(item._id)}>
                              Add to Garden
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Heart size={64} />
                    <h3>No items in wishlist</h3>
                    <p>Save your favorite plants to your wishlist for later.</p>
                    <button className="btn-primary" onClick={() => navigate('/shop')}>
                      Browse Plants
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'garden' && (
              <div className="content-section">
                <div className="section-header-simple">
                  <h2>My Garden</h2>
                </div>
                {gardenMessage && <div className="garden-alert garden-alert-success">{gardenMessage}</div>}
                {gardenError && <div className="garden-alert garden-alert-error">{gardenError}</div>}

                {gardenLoading ? (
                  <div className="empty-state">
                    <Sprout size={64} />
                    <h3>Loading your garden...</h3>
                    <p>Please wait while we fetch your plant collection.</p>
                  </div>
                ) : gardenPlants.length > 0 ? (
                  <>
                    <div className="garden-summary-grid">
                      <div className="garden-summary-card">
                        <span>Total Plants</span>
                        <strong>{gardenSummary.totalPlants || gardenPlants.length}</strong>
                      </div>
                      <div className="garden-summary-card">
                        <span>Healthy</span>
                        <strong>{gardenSummary.healthyPlants || 0}</strong>
                      </div>
                      <div className="garden-summary-card">
                        <span>Needs Attention</span>
                        <strong>{gardenSummary.attentionPlants || 0}</strong>
                      </div>
                      <div className="garden-summary-card">
                        <span>Reminders</span>
                        <strong>{gardenSummary.reminderCount || gardenReminders.length || 0}</strong>
                      </div>
                    </div>

                    <div className="garden-layout">
                      <div className="garden-collection">
                        <div className="section-header-inline">
                          <h3>Plant Collection</h3>
                        </div>
                        <div className="garden-grid">
                          {gardenPlants.map((plant) => (
                            <article key={plant._id} className="garden-card">
                              <div className="garden-card-image-wrap">
                                <img src={plant.product?.image} alt={plant.product?.name} className="garden-card-image" />
                                <span className={`garden-health-badge ${getGardenHealthClass(plant.healthStatus)}`}>
                                  {getStatusText(plant.healthStatus)}
                                </span>
                              </div>
                              <div className="garden-card-body">
                                <div className="garden-card-header">
                                  <div>
                                    <h4>{plant.product?.name}</h4>
                                    <p>{plant.product?.category}</p>
                                  </div>
                                  <span className="garden-quantity">x{plant.quantity}</span>
                                </div>
                                <div className="garden-card-meta">
                                  <span>Source: {plant.purchaseSource}</span>
                                  <span>Added: {formatGardenDate(plant.addedAt)}</span>
                                </div>
                                <div className="garden-card-reminders">
                                  {plant.reminders?.length > 0 ? (
                                    plant.reminders.slice(0, 2).map((reminder) => (
                                      <span key={`${plant._id}-${reminder.type}`} className="garden-reminder-pill">
                                        {reminder.label}: {getReminderLabel(reminder)}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="garden-reminder-pill calm">All care tasks on track</span>
                                  )}
                                </div>
                                <button className="btn-primary garden-manage-btn" onClick={() => openGardenPlant(plant)}>
                                  Manage Plant
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>

                      <div className="garden-sidebar-panels">
                        <div className="garden-panel">
                          <div className="section-header-inline">
                            <h3>Reminders</h3>
                          </div>
                          {gardenReminders.length > 0 ? (
                            <div className="reminder-list">
                              {gardenReminders.slice(0, 6).map((reminder, index) => (
                                <div key={`${reminder.type}-${index}`} className="reminder-item">
                                  <strong>{reminder.title}</strong>
                                  <p>{reminder.message}</p>
                                  <span>{getReminderLabel(reminder)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="garden-panel-empty">No reminders right now.</p>
                          )}
                        </div>

                        <div className="garden-panel">
                          <div className="section-header-inline">
                            <h3>Plant Timeline</h3>
                          </div>
                          <p className="garden-panel-empty">Select a plant to review its timeline and care history.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <Sprout size={64} />
                    <h3>Your garden is empty</h3>
                    <p>Purchased plants and wishlist transfers will appear here automatically.</p>
                    <button className="btn-primary" onClick={() => navigate('/shop')}>
                      Add Plants
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedGardenPlant && (
              <div className="garden-modal-overlay" onClick={closeGardenPlant} role="presentation">
                <div className="garden-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                  <div className="garden-modal-header">
                    <div>
                      <p className="tracking-modal-eyebrow">Plant Profile</p>
                      <h3>{selectedGardenPlant.product?.name}</h3>
                    </div>
                    <button type="button" className="tracking-close-btn" onClick={closeGardenPlant} aria-label="Close plant profile">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="garden-modal-top">
                    <img src={selectedGardenPlant.product?.image} alt={selectedGardenPlant.product?.name} className="garden-modal-image" />
                    <div className="garden-modal-info">
                      <div className="garden-modal-row">
                        <span>Purchase Source</span>
                        <strong>{selectedGardenPlant.purchaseSource}</strong>
                      </div>
                      <div className="garden-modal-row">
                        <span>Current Health</span>
                        <select
                          value={selectedGardenPlant.healthStatus}
                          onChange={(event) => handleGardenHealthChange(event.target.value)}
                          disabled={gardenActionLoading}
                        >
                          <option value="healthy">Healthy</option>
                          <option value="needs_water">Needs Water</option>
                          <option value="pest_warning">Pest Warning</option>
                          <option value="low_light">Low Light</option>
                        </select>
                      </div>
                      <div className="garden-modal-row">
                        <span>Category</span>
                        <strong>{selectedGardenPlant.product?.category}</strong>
                      </div>
                      <div className="garden-modal-row">
                        <span>Added On</span>
                        <strong>{formatGardenDate(selectedGardenPlant.addedAt)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="garden-care-grid">
                    <div className="garden-care-card">
                      <span>Watering</span>
                      <strong>{formatGardenDate(selectedGardenPlant.nextWateringAt)}</strong>
                      <p>Last watered: {formatGardenDate(selectedGardenPlant.lastWateredAt)}</p>
                      <button className="btn-secondary" onClick={() => handleGardenAction('watered')} disabled={gardenActionLoading}>
                        Mark Watered
                      </button>
                    </div>
                    <div className="garden-care-card">
                      <span>Fertilizing</span>
                      <strong>{formatGardenDate(selectedGardenPlant.nextFertilizingAt)}</strong>
                      <p>Last fertilized: {formatGardenDate(selectedGardenPlant.lastFertilizedAt)}</p>
                      <button className="btn-secondary" onClick={() => handleGardenAction('fertilized')} disabled={gardenActionLoading}>
                        Mark Fertilized
                      </button>
                    </div>
                    <div className="garden-care-card">
                      <span>Repotting</span>
                      <strong>{formatGardenDate(selectedGardenPlant.nextRepottingAt)}</strong>
                      <p>Last repotted: {formatGardenDate(selectedGardenPlant.lastRepottedAt)}</p>
                      <button className="btn-secondary" onClick={() => handleGardenAction('repotted')} disabled={gardenActionLoading}>
                        Mark Repotted
                      </button>
                    </div>
                  </div>

                  <div className="garden-notes-section">
                    <div className="section-header-inline">
                      <h3>Notes & Journal</h3>
                    </div>
                    <textarea
                      className="garden-note-input"
                      value={gardenNoteDraft}
                      onChange={(event) => setGardenNoteDraft(event.target.value)}
                      placeholder="Write growth updates, issues, or care observations..."
                      rows="3"
                    />
                    <button className="btn-primary" onClick={handleAddGardenNote} disabled={gardenActionLoading || !gardenNoteDraft.trim()}>
                      Add Note
                    </button>

                    <div className="garden-notes-list">
                      {(selectedGardenPlant.notes || []).length > 0 ? (
                        selectedGardenPlant.notes.map((note, index) => (
                          <div key={`${selectedGardenPlant._id}-note-${index}`} className="garden-note-item">
                            <strong>{formatGardenDate(note.createdAt)}</strong>
                            <p>{note.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="garden-panel-empty">No notes yet for this plant.</p>
                      )}
                    </div>
                  </div>

                  <div className="garden-timeline-section">
                    <div className="section-header-inline">
                      <h3>Timeline</h3>
                    </div>
                    <div className="garden-timeline-list">
                      {(selectedGardenPlant.timeline || []).length > 0 ? (
                        selectedGardenPlant.timeline.map((entry, index) => (
                          <div key={`${selectedGardenPlant._id}-timeline-${index}`} className="garden-timeline-item">
                            <div className="garden-timeline-dot" />
                            <div>
                              <strong>{entry.title}</strong>
                              <p>{entry.description}</p>
                              <span>{formatGardenDate(entry.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="garden-panel-empty">No timeline entries yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {trackingOrderId && (
              <div className="tracking-modal-overlay" onClick={closeTrackingModal} role="presentation">
                <div className="tracking-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                  <div className="tracking-modal-header">
                    <div>
                      <p className="tracking-modal-eyebrow">Order Tracking</p>
                      <h3>{trackingData?.orderNumber || 'Loading order...'}</h3>
                    </div>
                    <button type="button" className="tracking-close-btn" onClick={closeTrackingModal} aria-label="Close tracking modal">
                      <X size={20} />
                    </button>
                  </div>

                  {trackingLoading ? (
                    <div className="tracking-loading">Loading tracking information...</div>
                  ) : trackingError ? (
                    <div className="tracking-error-state">
                      <ShoppingBag size={40} />
                      <h4>Unable to load tracking info</h4>
                      <p>{trackingError}</p>
                    </div>
                  ) : trackingData ? (
                    <>
                      <div className="tracking-summary">
                        <div>
                          <span>Status</span>
                          <strong>{getStatusText(trackingData.orderStatus)}</strong>
                        </div>
                        <div>
                          <span>Progress</span>
                          <strong>{trackingData.progress}%</strong>
                        </div>
                        <div>
                          <span>Estimated Delivery</span>
                          <strong>{formatTrackingDate(trackingData.estimatedDeliveryDate)}</strong>
                        </div>
                      </div>

                      <div className="tracking-steps">
                        {trackingData.steps.map((step, index) => (
                          <div key={step.key} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                            <div className="tracking-step-marker">{index + 1}</div>
                            <div className="tracking-step-content">
                              <strong>{step.label}</strong>
                              <p>{step.active ? 'Current stage' : step.completed ? 'Completed' : 'Pending'}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="tracking-order-meta">
                        <div>
                          <span>Placed On</span>
                          <strong>{formatTrackingDate(trackingData.timestamps?.createdAt)}</strong>
                        </div>
                        <div>
                          <span>Payment Status</span>
                          <strong>{getStatusText(trackingData.paymentStatus)}</strong>
                        </div>
                        <div>
                          <span>Cancelable</span>
                          <strong>{trackingData.canCancel ? 'Yes' : 'No'}</strong>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && cancelOrderId && (
              <div className="cancel-modal-overlay" onClick={closeCancelModal} role="presentation">
                <div className="cancel-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                  <div className="cancel-modal-header">
                    <h3>Cancel Order?</h3>
                    <button type="button" className="cancel-close-btn" onClick={closeCancelModal} aria-label="Close cancel modal">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="cancel-modal-body">
                    <p className="cancel-modal-message">
                      Are you sure you want to cancel this order? Once cancelled:
                    </p>
                    <ul className="cancel-modal-list">
                      <li>Your payment will be refunded to your original payment method</li>
                      <li>Refund may take 5-7 business days to appear in your account</li>
                      <li>Product stock will be restored for other customers</li>
                      <li>This action cannot be undone once confirmed</li>
                    </ul>
                    {cancelError && (
                      <div className="cancel-modal-error">
                        <p>{cancelError}</p>
                      </div>
                    )}
                  </div>

                  <div className="cancel-modal-footer">
                    <button 
                      className="btn-secondary" 
                      onClick={closeCancelModal}
                      disabled={cancelLoading}
                    >
                      Keep Order
                    </button>
                    <button 
                      className="btn-cancel-confirm" 
                      onClick={handleCancelOrder}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Success Modal */}
            {cancelResult && (
              <div className="cancel-modal-overlay" onClick={closeCancelModal} role="presentation">
                <div className="cancel-modal cancel-success-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                  <div className="cancel-modal-header">
                    <h3>Order Cancelled Successfully ✓</h3>
                    <button type="button" className="cancel-close-btn" onClick={closeCancelModal} aria-label="Close success modal">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="cancel-modal-body">
                    <div className="success-icon">✓</div>
                    <p className="success-message">{cancelResult.message}</p>
                    
                    {cancelResult.order?.refund && (
                      <div className="refund-details-box">
                        <h4>Refund Details</h4>
                        <div className="refund-detail-row">
                          <span>Refund Amount:</span>
                          <strong>{formatPrice(cancelResult.order.refund.amount)}</strong>
                        </div>
                        <div className="refund-detail-row">
                          <span>Refund ID:</span>
                          <strong className="refund-id">{cancelResult.order.refund.refundId}</strong>
                        </div>
                        <div className="refund-detail-row">
                          <span>Status:</span>
                          <strong className="refund-status">{cancelResult.order.refund.status}</strong>
                        </div>
                        <p className="refund-timeline">
                          The refund will be processed to your original payment method within 5-7 business days.
                        </p>
                      </div>
                    )}

                    <div className="order-details-compact">
                      <h4>Order Details</h4>
                      <div className="order-detail-row">
                        <span>Order Number:</span>
                        <strong>{cancelResult.order?.orderNumber}</strong>
                      </div>
                      <div className="order-detail-row">
                        <span>Total Amount:</span>
                        <strong>{formatPrice(cancelResult.order?.total)}</strong>
                      </div>
                      <div className="order-detail-row">
                        <span>Cancelled On:</span>
                        <strong>{formatTrackingDate(cancelResult.order?.cancelledAt)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="cancel-modal-footer">
                    <button 
                      className="btn-primary" 
                      onClick={closeCancelModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
  
  export default Account;