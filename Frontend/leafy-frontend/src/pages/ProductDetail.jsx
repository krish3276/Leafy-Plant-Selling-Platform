import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Sun,
  Droplets,
  Ruler,
  Leaf,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { productAPI, cartAPI } from '../utils/api';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      if (response.success) {
        setProduct(response.product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock || 10)) {
      setQuantity(newQty);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      showNotification('Please log in to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart(product._id, quantity);
      if (response.success) {
        showNotification(`🌱 Added ${quantity} item(s) to cart!`, 'success');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification(err.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'hard':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getSunlightIcon = (level) => {
    const count = level === 'low' ? 1 : level === 'medium' ? 2 : 3;
    return Array(count).fill('☀️').join('');
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-loading">
          <div className="loader"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-error">
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <Link to="/shop" className="back-to-shop">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Notification */}
      {notification && (
        <div className={`product-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <Link to="/shop" className="back-link">
        <ArrowLeft size={18} />
        Back to Shop
      </Link>

      <div className="product-detail-content">
        {/* Product Image */}
        <div className="product-image-section">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
            {product.stock === 0 && (
              <div className="out-of-stock-overlay">Out of Stock</div>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <div className="low-stock-badge">Only {product.stock} left!</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <span className="product-category-badge">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>

          {/* Rating */}
          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= (product.rating || 4) ? '#ffc107' : 'none'}
                  stroke={star <= (product.rating || 4) ? '#ffc107' : '#ddd'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating || 4.0} ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="product-price">${product.price.toFixed(2)}</p>

          <p className="product-description">{product.description}</p>

          {/* Plant Care Info */}
          <div className="care-info">
            <div className="care-item">
              <Sun size={20} />
              <div>
                <span className="care-label">Sunlight</span>
                <span className="care-value">{getSunlightIcon(product.sunlight)} {product.sunlight || 'Medium'}</span>
              </div>
            </div>
            <div className="care-item">
              <Droplets size={20} />
              <div>
                <span className="care-label">Watering</span>
                <span className="care-value">{product.waterFrequency || 'Once a week'}</span>
              </div>
            </div>
            <div className="care-item">
              <Ruler size={20} />
              <div>
                <span className="care-label">Size</span>
                <span className="care-value">{product.size || 'Medium'}</span>
              </div>
            </div>
            <div className="care-item">
              <Leaf size={20} />
              <div>
                <span className="care-label">Difficulty</span>
                <span
                  className="care-value"
                  style={{ color: getDifficultyColor(product.difficulty) }}
                >
                  {product.difficulty || 'Medium'}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`}
              onClick={addToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              <ShoppingCart size={20} />
              {product.stock === 0
                ? 'Out of Stock'
                : addingToCart
                ? 'Adding...'
                : 'Add to Cart'}
            </button>

            <button className="wishlist-btn" title="Add to Wishlist">
              <Heart size={20} />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="shipping-item">
              <Truck size={18} />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="shipping-item">
              <Shield size={18} />
              <span>Plant health guarantee</span>
            </div>
            <div className="shipping-item">
              <RotateCcw size={18} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
