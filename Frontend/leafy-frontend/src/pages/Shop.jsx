import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { productAPI, cartAPI } from '../utils/api';
import '../styles/Shop.css';

function Shop() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest',
  });

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Sync filters.category with the URL param when route changes
  useEffect(() => {
    // category will be undefined on /shop route, so normalize to empty string
    const routeCategory = category || '';
    setFilters((prev) => (prev.category === routeCategory ? prev : { ...prev, category: routeCategory }));
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAllProducts(filters);
      
      if (response.success) {
        setProducts(response.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    const newCategory = category === filters.category ? '' : category;
    setFilters({ ...filters, category: newCategory });
    // Keep URL in sync with selected category
    if (newCategory) {
      navigate(`/shop/${newCategory}`);
    } else {
      navigate('/shop');
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      showNotification('Please log in to add items to cart', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setAddingToCart(productId);
    try {
      const response = await cartAPI.addToCart(productId, 1);
      if (response.success) {
        showNotification('🌱 Added to cart!', 'success');
        // Dispatch custom event to update navbar cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification(err.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Notification Toast */}
      {notification && (
        <div className={`shop-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="shop-header">
        <h1>Shop All Plants</h1>
        <p>Discover our full collection of beautiful plants</p>
      </div>

      {/* Filters Section */}
      <div className="shop-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search plants..."
            value={filters.search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <div className="category-buttons">
            <button
              className={filters.category === '' ? 'active' : ''}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            <button
              className={filters.category === 'indoor' ? 'active' : ''}
              onClick={() => handleCategoryChange('indoor')}
            >
              Indoor
            </button>
            <button
              className={filters.category === 'outdoor' ? 'active' : ''}
              onClick={() => handleCategoryChange('outdoor')}
            >
              Outdoor
            </button>
            <button
              className={filters.category === 'succulents' ? 'active' : ''}
              onClick={() => handleCategoryChange('succulents')}
            >
              Succulents
            </button>
            <button
              className={filters.category === 'accessories' ? 'active' : ''}
              onClick={() => handleCategoryChange('accessories')}
            >
              Accessories
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={filters.sort} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-image-link">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.stock === 0 && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <div className="low-stock-badge">Only {product.stock} left!</div>
                    )}
                  </div>
                </Link>
                <div className="product-info">
                  <Link to={`/product/${product._id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  
                  <div className="product-meta">
                    <span className="difficulty">
                      🌱 {product.difficulty || 'Medium'}
                    </span>
                    <span className="sunlight">
                      ☀️ {product.sunlight || 'Medium'}
                    </span>
                  </div>

                  <button
                    className={`add-to-cart-btn ${addingToCart === product._id ? 'adding' : ''}`}
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0 || addingToCart === product._id}
                  >
                    {product.stock === 0 ? (
                      'Out of Stock'
                    ) : addingToCart === product._id ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Shop;
