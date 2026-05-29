import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Home, CreditCard } from 'lucide-react';
import '../styles/OrderConfirmation.css';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (v) => priceFormatter.format(Number(v || 0));

const PAYMENT_METHOD_LABELS = {
  razorpay: { label: 'Razorpay (Online)', color: '#528ff5', bg: '#eef3ff' },
  card: { label: 'Credit/Debit Card', color: '#4caf50', bg: '#e8f5e9' },
  cod: { label: 'Cash on Delivery', color: '#f57c00', bg: '#fff3e0' },
};

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-loading">
          <div className="loader"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-error">
          <h2>Order Not Found</h2>
          <p>{error || 'Unable to find your order.'}</p>
          <Link to="/shop" className="shop-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      {/* Success Header */}
      <div className="confirmation-header">
        <div className="success-icon">
          <CheckCircle size={60} />
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your plants are on their way! 🌱</p>
        <div className="order-number">
          Order Number: <strong>{order.orderNumber}</strong>
        </div> <br />
        {/* Payment Method Badge */}
        {order.paymentMethod && (() => {
          const pm = PAYMENT_METHOD_LABELS[order.paymentMethod] || { label: order.paymentMethod, color: '#666', bg: '#f5f5f5' };
          return (
            <div className="payment-badge" style={{ background: pm.bg, color: pm.color }}>
              <CreditCard size={14} />
              <span>{pm.label}</span>
              {order.paymentStatus === 'paid' && <CheckCircle size={14} />}
            </div>
          );
        })()}
      </div>

      {/* Order Timeline */}
      <div className="order-timeline">
        <div className="timeline-step active">
          <div className="step-icon">
            <CheckCircle size={24} />
          </div>
          <p>Order Confirmed</p>
        </div>
        <div className="timeline-line"></div>
        <div className="timeline-step">
          <div className="step-icon">
            <Package size={24} />
          </div>
          <p>Processing</p>
        </div>
        <div className="timeline-line"></div>
        <div className="timeline-step">
          <div className="step-icon">
            <Truck size={24} />
          </div>
          <p>Shipped</p>
        </div>
        <div className="timeline-line"></div>
        <div className="timeline-step">
          <div className="step-icon">
            <Home size={24} />
          </div>
          <p>Delivered</p>
        </div>
      </div>

      <div className="confirmation-content">
        {/* Order Items */}
        <div className="confirmation-section">
          <h2>
            <Package size={20} />
            Order Items
          </h2>
          <div className="confirmation-order-items">
            {order.items.map((item, index) => (
              <div key={index} className="confirmation-order-item">
                <img src={item.image} alt={item.name} />
                <div className="confirmation-item-info">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="confirmation-item-price">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Tax (8%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            {order.razorpayPaymentId && (
              <div className="total-row" style={{ fontSize: '0.8rem', color: '#888' }}>
                <span>Payment ID</span>
                <span style={{ fontFamily: 'monospace' }}>{order.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="confirmation-section">
          <h2>
            <MapPin size={20} />
            Shipping Address
          </h2>
          <div className="shipping-details">
            <p className="recipient-name">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="confirmation-actions">
        <Link to="/account" className="view-orders-btn">
          View My Orders
          <ArrowRight size={18} />
        </Link>
        <Link to="/shop" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
