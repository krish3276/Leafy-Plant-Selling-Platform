import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { cartAPI } from '../utils/api';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.success) {
        setCartItems(response.cart || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(productId);
    try {
      const response = await cartAPI.updateCartItem(productId, newQuantity);
      if (response.success) {
        setCartItems(response.cart);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId) => {
    setUpdating(productId);
    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.success) {
        setCartItems(response.cart);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    return subtotal + calculateTax() + shipping;
  };

  // Not logged in
  const isLoggedIn = !!localStorage.getItem('authToken');
  
  if (!isLoggedIn) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <ShoppingCart size={80} className="empty-cart-icon" />
          <h2>Please log in to view your cart</h2>
          <p>Sign in to add items and checkout</p>
          <Link to="/login" className="continue-shopping-btn">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="loader"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-error">
          <p>{error}</p>
          <button onClick={fetchCart} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <ShoppingBag size={80} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any plants yet!</p>
          <Link to="/shop" className="continue-shopping-btn">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = calculateTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1><ShoppingCart size={28} /> Shopping Cart</h1>
        <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div key={product._id} className={`cart-item ${updating === product._id ? 'updating' : ''}`}>
                <div className="cart-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{product.name}</h3>
                  <p className="cart-item-category">{product.category}</p>
                  <p className="cart-item-price">${product.price?.toFixed(2)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating === product._id}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(product._id, item.quantity + 1)}
                    disabled={updating === product._id}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-total">
                  <p>${(product.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(product._id)}
                  disabled={updating === product._id}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}

          <div className="cart-actions">
            <Link to="/shop" className="continue-shopping-link">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <button className="clear-cart-btn" onClick={clearCart}>
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          
          {shipping === 0 && (
            <div className="free-shipping-note">
              🎉 You qualify for free shipping!
            </div>
          )}
          
          {shipping > 0 && (
            <div className="shipping-note">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping
            </div>
          )}
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>

          <div className="secure-checkout">
            🔒 Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
