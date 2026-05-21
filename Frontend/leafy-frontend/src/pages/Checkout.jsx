import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { cartAPI } from '../utils/api';
import { initiateRazorpayPayment } from '../utils/razorpay';
import '../styles/Checkout.css';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = (value) => priceFormatter.format(Number(value || 0));

const API_BASE_URL = 'http://localhost:5000/api';

// ─── Test Card Details ────────────────────────────────────────────────────────
const TEST_CARDS = [
  { label: 'Success', number: '4111 1111 1111 1111', cvv: '123', expiry: '12/28' },
  { label: 'International', number: '5267 3181 8797 5449', cvv: '123', expiry: '12/28' },
];

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState(''); // 'creating' | 'verifying' | ''
  const [error, setError] = useState(null);
  const [copiedCard, setCopiedCard] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'razorpay',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.success) {
        if (!response.cart || response.cart.length === 0) {
          navigate('/cart');
          return;
        }
        setCartItems(response.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  // ── Handle COD Order ──────────────────────────────────────────────────────
  const handleCODOrder = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: 'cod',
        notes: formData.notes,
      }),
    });
    const data = await response.json();
    if (data.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      navigate(`/order-confirmation/${data.order._id}`, { state: { order: data.order } });
    } else {
      throw new Error(data.message || 'Failed to place COD order');
    }
  };

  // ── Handle Razorpay Payment ───────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem('authToken');

    // Step 1: Open Razorpay modal
    setPaymentStep('creating');
    const paymentResponse = await initiateRazorpayPayment({
      token,
      userInfo: {
        name: formData.fullName,
        email: localStorage.getItem('userEmail') || '',
        phone: formData.phone,
      },
    });

    // Step 2: Verify payment & create DB order
    setPaymentStep('verifying');
    const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        notes: formData.notes,
      }),
    });

    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      navigate(`/order-confirmation/${verifyData.order._id}`, {
        state: { order: verifyData.order },
      });
    } else {
      throw new Error(verifyData.message || 'Payment verification failed');
    }
  };

  // ── Main Submit Handler ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setPaymentStep('');

    try {
      if (formData.paymentMethod === 'cod') {
        await handleCODOrder();
      } else {
        await handleRazorpayPayment();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.message || '';
      if (msg.includes('cancelled')) {
        setError('Payment was cancelled. You can try again.');
      } else {
        setError(msg || 'Payment failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
      setPaymentStep('');
    }
  };

  const copyToClipboard = (text, cardIndex) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedCard(cardIndex);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  const getButtonLabel = () => {
    if (!submitting) {
      return formData.paymentMethod === 'cod'
        ? `Place Order — ${formatPrice(total)}`
        : `Pay ${formatPrice(total)} via Razorpay`;
    }
    if (paymentStep === 'creating') return 'Opening Payment Gateway...';
    if (paymentStep === 'verifying') return 'Verifying Payment...';
    return 'Processing...';
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <div className="loader"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Link to="/cart" className="back-link">
        <ArrowLeft size={18} />
        Back to Cart
      </Link>

      <h1 className="checkout-title">Checkout</h1>

      {error && (
        <div className="checkout-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="checkout-content">
        {/* ── Checkout Form ─────────────────────────────────────────────── */}
        <form className="checkout-form" onSubmit={handleSubmit}>

          {/* Shipping Information */}
          <div className="form-section">
            <h2>
              <Truck size={20} />
              Shipping Information
            </h2>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Krish Sirsath"
                className={formErrors.fullName ? 'error' : ''}
              />
              {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Green Street"
                className={formErrors.address ? 'error' : ''}
              />
              {formErrors.address && <span className="error-text">{formErrors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className={formErrors.city ? 'error' : ''}
                />
                {formErrors.city && <span className="error-text">{formErrors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className={formErrors.state ? 'error' : ''}
                />
                {formErrors.state && <span className="error-text">{formErrors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">PIN Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="400001"
                  className={formErrors.zipCode ? 'error' : ''}
                />
                {formErrors.zipCode && <span className="error-text">{formErrors.zipCode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <h2>
              <CreditCard size={20} />
              Payment Method
            </h2>

            <div className="payment-options">
              {/* Razorpay Option */}
              <label
                className={`payment-option razorpay-option ${
                  formData.paymentMethod === 'razorpay' ? 'selected' : ''
                }`}
                id="payment-razorpay"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={handleChange}
                />
                <div className="razorpay-badge">
                  <span className="rzp-logo">Rzp</span>
                  <span>Pay via Razorpay</span>
                </div>
                {formData.paymentMethod === 'razorpay' && (
                  <CheckCircle size={18} className="check-icon" />
                )}
              </label>

              {/* COD Option */}
              <label
                className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                id="payment-cod"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <Truck size={20} />
                <span>Cash on Delivery</span>
                {formData.paymentMethod === 'cod' && (
                  <CheckCircle size={18} className="check-icon" />
                )}
              </label>
            </div>

            {/* Test Mode Info Box */}
            {formData.paymentMethod === 'razorpay' && (
              <div className="test-card-info">
                <div className="test-card-header">
                  <Shield size={16} />
                  <span>Test Mode — Use the cards below to simulate payment</span>
                </div>
                <div className="test-cards-grid">
                  {TEST_CARDS.map((card, idx) => (
                    <div key={idx} className="test-card-item">
                      <div className="test-card-label">{card.label}</div>
                      <div className="test-card-number">
                        <code>{card.number}</code>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => copyToClipboard(card.number, idx)}
                          title="Copy card number"
                        >
                          {copiedCard === idx ? <CheckCircle size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="test-card-meta">
                        <span>CVV: <strong>{card.cvv}</strong></span>
                        <span>Expiry: <strong>{card.expiry}</strong></span>
                        <span>OTP: <strong>1234</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.paymentMethod === 'cod' && (
              <div className="card-note">
                <Truck size={16} />
                <span>Pay with cash when your plants are delivered at your doorstep.</span>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div className="form-section">
            <h2>Order Notes (Optional)</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special instructions for delivery..."
              rows={3}
            />
          </div>
        </form>

        {/* ── Order Summary ──────────────────────────────────────────────── */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={product._id} className="summary-item">
                  <img src={product.image} alt={product.name} />
                  <div className="item-details">
                    <p className="item-name">{product.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">{formatPrice(product.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            id="place-order-btn"
            className={`place-order-btn ${
              formData.paymentMethod === 'razorpay' ? 'razorpay-btn' : 'cod-btn'
            }`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting && <span className="btn-spinner"></span>}
            {getButtonLabel()}
          </button>

          {formData.paymentMethod === 'razorpay' && (
            <div className="razorpay-powered">
              <Shield size={14} />
              <span>Secured by</span>
              <span className="rzp-powered-logo">Razorpay</span>
            </div>
          )}

          {formData.paymentMethod === 'cod' && (
            <div className="secure-checkout">
              <Shield size={16} />
              <span>Safe & Secure Checkout</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
