import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { cartAPI } from '../utils/api';
import '../styles/Checkout.css';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = (value) => priceFormatter.format(Number(value || 0));

const API_BASE_URL = 'http://localhost:5000/api';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card',
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
    // Clear error when user types
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
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
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        // Navigate to order confirmation
        navigate(`/order-confirmation/${data.order._id}`, {
          state: { order: data.order },
        });
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-content">
        {/* Checkout Form */}
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
                placeholder="John Doe"
                className={formErrors.fullName ? 'error' : ''}
              />
              {formErrors.fullName && (
                <span className="error-text">{formErrors.fullName}</span>
              )}
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
              {formErrors.address && (
                <span className="error-text">{formErrors.address}</span>
              )}
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
                  placeholder="New York"
                  className={formErrors.city ? 'error' : ''}
                />
                {formErrors.city && (
                  <span className="error-text">{formErrors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className={formErrors.state ? 'error' : ''}
                />
                {formErrors.state && (
                  <span className="error-text">{formErrors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={formErrors.zipCode ? 'error' : ''}
                />
                {formErrors.zipCode && (
                  <span className="error-text">{formErrors.zipCode}</span>
                )}
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
                placeholder="(555) 123-4567"
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && (
                <span className="error-text">{formErrors.phone}</span>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <h2>
              <CreditCard size={20} />
              Payment Method
            </h2>

            <div className="payment-options">
              <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <CreditCard size={20} />
                <span>Credit/Debit Card</span>
              </label>

              <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <Truck size={20} />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="card-note">
                <Shield size={16} />
                <span>For demo purposes, no actual payment will be processed.</span>
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

        {/* Order Summary */}
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
                  <p className="item-price">
                    {formatPrice(product.price * item.quantity)}
                  </p>
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
            className="place-order-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
          </button>

          <div className="secure-checkout">
            <Shield size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
