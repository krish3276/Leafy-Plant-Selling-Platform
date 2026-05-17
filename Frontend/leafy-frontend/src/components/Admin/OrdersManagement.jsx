import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Package,
  RefreshCw,
  Save,
  Search,
  Truck,
  X,
} from 'lucide-react';
import './OrdersManagement.css';

const API_BASE = 'http://localhost:5000/api/orders';

const orderStatusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem('authToken');

  const loadOrders = async ({ silent = false, pageOverride, searchOverride } = {}) => {
    const effectivePage = pageOverride ?? page;
    const effectiveSearch = searchOverride ?? searchQuery;

    try {
      if (!silent) {
        setLoading(true);
      }

      setError('');
      const params = new URLSearchParams();
      params.append('page', String(effectivePage));
      params.append('limit', '10');

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      if (paymentFilter) {
        params.append('paymentStatus', paymentFilter);
      }

      if (effectiveSearch.trim()) {
        params.append('search', effectiveSearch.trim());
      }

      const response = await fetch(`${API_BASE}/admin/all?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!data.success) {
        setError(data.message || 'Failed to load orders');
        return;
      }

      setOrders(data.orders || []);
      setSummary(data.summary || null);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || effectivePage);
      setDrafts(
        (data.orders || []).reduce((accumulator, order) => {
          accumulator[order._id] = {
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
          };
          return accumulator;
        }, {})
      );
      setSelectedOrder((currentSelected) => {
        if (!currentSelected) {
          return currentSelected;
        }

        return (data.orders || []).find((order) => order._id === currentSelected._id) || currentSelected;
      });
    } catch (fetchError) {
      console.error('Fetch orders error:', fetchError);
      setError('Failed to load orders');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders({ silent: true });
    }, 15000);

    return () => clearInterval(interval);
  }, [page, statusFilter, paymentFilter, searchQuery]);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput);
  };

  const handleDraftChange = (orderId, field, value) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [orderId]: {
        ...(currentDrafts[orderId] || {}),
        [field]: value,
      },
    }));
  };

  const handleUpdateOrder = async (orderId) => {
    const draft = drafts[orderId];

    if (!draft) {
      return;
    }

    try {
      setSavingOrderId(orderId);
      setError('');

      const response = await fetch(`${API_BASE}/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderStatus: draft.orderStatus,
          paymentStatus: draft.paymentStatus,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!data.success) {
        setError(data.message || 'Failed to update order');
        return;
      }

      setSuccess(`Order ${data.order.orderNumber} updated successfully`);
      setTimeout(() => setSuccess(''), 3000);
      await loadOrders({ silent: true });
    } catch (updateError) {
      console.error('Update order error:', updateError);
      setError('Failed to update order');
    } finally {
      setSavingOrderId('');
    }
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const statusMeta = useMemo(() => ({
    pending: { label: 'Pending', className: 'pending' },
    confirmed: { label: 'Confirmed', className: 'confirmed' },
    processing: { label: 'Processing', className: 'processing' },
    shipped: { label: 'Shipped', className: 'shipped' },
    delivered: { label: 'Delivered', className: 'delivered' },
    cancelled: { label: 'Cancelled', className: 'cancelled' },
  }), []);

  const paymentMeta = useMemo(() => ({
    pending: { label: 'Pending', className: 'pending' },
    paid: { label: 'Paid', className: 'paid' },
    failed: { label: 'Failed', className: 'failed' },
    refunded: { label: 'Refunded', className: 'refunded' },
  }), []);

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return priceFormatter.format(amount);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return 'N/A';
    }

    return new Date(dateValue).toLocaleString();
  };

  const getCustomerName = (order) => {
    if (order.user?.firstName || order.user?.lastName) {
      return `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
    }

    return order.shippingAddress?.fullName || 'Customer';
  };

  const totalItems = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="orders-management">
      <div className="orders-toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search order number, name, phone, or product..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
          />
          <button type="button" className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="toolbar-actions">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {statusMeta[status].label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={paymentFilter}
            onChange={(event) => {
              setPaymentFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Payments</option>
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {paymentMeta[status].label}
              </option>
            ))}
          </select>

          <button type="button" className="refresh-btn" onClick={handleRefresh} title="Refresh orders">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓ {success}</span>
        </div>
      )}

      <div className="orders-summary">
        <div className="summary-card">
          <div className="summary-icon total">
            <Package size={24} />
          </div>
          <div>
            <p className="summary-label">Total Orders</p>
            <h3>{summary?.totalOrders ?? 0}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon pending">
            <Clock3 size={24} />
          </div>
          <div>
            <p className="summary-label">Pending</p>
            <h3>{summary?.pendingOrders ?? 0}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon delivered">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="summary-label">Delivered</p>
            <h3>{summary?.deliveredOrders ?? 0}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon revenue">
            <Truck size={24} />
          </div>
          <div>
            <p className="summary-label">Revenue</p>
            <h3>{formatMoney(summary?.totalRevenue ?? 0)}</h3>
          </div>
        </div>
      </div>

      {summary && (
        <div className="summary-meta">
          <span>Confirmed: {summary.confirmedOrders ?? 0}</span>
          <span>Processing: {summary.processingOrders ?? 0}</span>
          <span>Shipped: {summary.shippedOrders ?? 0}</span>
          <span>Cancelled: {summary.cancelledOrders ?? 0}</span>
        </div>
      )}

      <div className="orders-table-container">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Placed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const draft = drafts[order._id] || {
                        orderStatus: order.orderStatus,
                        paymentStatus: order.paymentStatus,
                      };

                      return (
                        <tr key={order._id}>
                          <td>
                            <div className="order-cell">
                              <strong>{order.orderNumber}</strong>
                              <span>{order._id.slice(-6).toUpperCase()}</span>
                            </div>
                          </td>
                          <td>
                            <div className="customer-cell">
                              <strong>{getCustomerName(order)}</strong>
                              <span>{order.user?.email || order.shippingAddress?.phone}</span>
                            </div>
                          </td>
                          <td>
                            <span className="items-count">{totalItems(order)} item(s)</span>
                          </td>
                          <td>
                            <strong>{formatMoney(order.total)}</strong>
                          </td>
                          <td>
                            <select
                              className={`status-select ${statusMeta[draft.orderStatus]?.className || ''}`}
                              value={draft.orderStatus}
                              onChange={(event) => handleDraftChange(order._id, 'orderStatus', event.target.value)}
                            >
                              {orderStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {statusMeta[status].label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className={`status-select ${paymentMeta[draft.paymentStatus]?.className || ''}`}
                              value={draft.paymentStatus}
                              onChange={(event) => handleDraftChange(order._id, 'paymentStatus', event.target.value)}
                            >
                              {paymentStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {paymentMeta[status].label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="view-btn"
                                onClick={() => setSelectedOrder(order)}
                                title="View details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                type="button"
                                className="save-btn"
                                onClick={() => handleUpdateOrder(order._id)}
                                disabled={savingOrderId === order._id}
                              >
                                <Save size={18} />
                                {savingOrderId === order._id ? 'Saving' : 'Save'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-message">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)} role="presentation">
          <div className="order-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="order-modal-header">
              <div>
                <p className="modal-eyebrow">Order Details</p>
                <h2>{selectedOrder.orderNumber}</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedOrder(null)} aria-label="Close order details">
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-grid">
              <div className="detail-card">
                <h3>Customer</h3>
                <p>{getCustomerName(selectedOrder)}</p>
                <span>{selectedOrder.user?.email || selectedOrder.shippingAddress?.phone}</span>
              </div>

              <div className="detail-card">
                <h3>Shipping</h3>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <span>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </span>
              </div>

              <div className="detail-card">
                <h3>Timeline</h3>
                <p>Placed: {formatDate(selectedOrder.createdAt)}</p>
                <span>
                  Delivered: {formatDate(selectedOrder.deliveredAt)}
                </span>
              </div>

              <div className="detail-card">
                <h3>Payment</h3>
                <p>{formatMoney(selectedOrder.total)}</p>
                <span>
                  Method: {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>

            <div className="order-modal-section">
              <h3>Items</h3>
              <div className="modal-items-list">
                {selectedOrder.items.map((item) => (
                  <div className="modal-item" key={`${selectedOrder._id}-${item.product?._id || item.name}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <p>{formatMoney(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-modal-actions">
              <div className="modal-status-group">
                <label>
                  Order Status
                  <select
                    value={drafts[selectedOrder._id]?.orderStatus || selectedOrder.orderStatus}
                    onChange={(event) => handleDraftChange(selectedOrder._id, 'orderStatus', event.target.value)}
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusMeta[status].label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Payment Status
                  <select
                    value={drafts[selectedOrder._id]?.paymentStatus || selectedOrder.paymentStatus}
                    onChange={(event) => handleDraftChange(selectedOrder._id, 'paymentStatus', event.target.value)}
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {paymentMeta[status].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button type="button" className="save-btn modal-save-btn" onClick={() => handleUpdateOrder(selectedOrder._id)}>
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersManagement;