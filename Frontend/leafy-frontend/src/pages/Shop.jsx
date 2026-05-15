import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { productAPI, cartAPI } from '../utils/api';
import '../styles/Shop.css';

function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest',
  });

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const routeSearch = searchParams.get('search') || '';
    const routeCategory = category || '';

    setSearchInput(routeSearch);

    setFilters((prev) => {
      const nextFilters = {
        ...prev,
        category: routeCategory,
        search: routeSearch,
      };

      if (prev.category === nextFilters.category && prev.search === nextFilters.search) {
        return prev;
      }

      return nextFilters;
    });
  }, [category, location.search]);

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
      navigate(filters.search ? `/shop/${newCategory}?search=${encodeURIComponent(filters.search)}` : `/shop/${newCategory}`);
    } else {
      navigate(filters.search ? `/shop?search=${encodeURIComponent(filters.search)}` : '/shop');
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const applySearch = () => {
    const nextSearch = searchInput.trim();
    setFilters({ ...filters, search: nextSearch });

    if (filters.category) {
      navigate(nextSearch ? `/shop/${filters.category}?search=${encodeURIComponent(nextSearch)}` : `/shop/${filters.category}`);
    } else {
      navigate(nextSearch ? `/shop?search=${encodeURIComponent(nextSearch)}` : '/shop');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applySearch();
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
        <h1>
          {filters.category === '' && 'Shop All Plants'}
          {filters.category === 'indoor' && 'Indoor Plants'}
          {filters.category === 'outdoor' && 'Outdoor Plants'}
          {filters.category === 'succulents' && 'Succulents'}
          {filters.category === 'accessories' && 'Plant Care Tools & Accessories'}
        </h1>
        <p>
          {filters.category === '' && 'Discover our full collection of beautiful plants'}
          {filters.category === 'indoor' && 'Transform your indoor spaces with our curated selection'}
          {filters.category === 'outdoor' && 'Beautify your garden and patio with outdoor plants'}
          {filters.category === 'succulents' && 'Low-maintenance succulents for modern spaces'}
          {filters.category === 'accessories' && 'Everything you need for healthy, thriving plants'}
        </p>
      </div>

      {/* Filters Section */}
      <div className="shop-filters">
        <div className="filter-group search-filter-group">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search plants..."
              value={searchInput}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        <div className="filter-group category-filter-group">
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

        <div className="filter-group sort-filter-group">
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
                  <p className="product-price">₹{product.price}</p>
                  
                  {filters.category !== 'accessories' ? (
                    <div className="product-meta">
                      <span className="difficulty">
                        🌱 {product.difficulty || 'Medium'}
                      </span>
                      <span className="sunlight">
                        ☀️ {product.sunlight || 'Medium'}
                      </span>
                    </div>
                  ) : (
                    <div className="product-meta">
                      {product.toolType && (
                        <span className="tool-type">
                          🛠️ {product.toolType.replace(/-/g, ' ')}
                        </span>
                      )}
                      {product.warranty && (
                        <span className="warranty">
                          ✓ {product.warranty}
                        </span>
                      )}
                    </div>
                  )}

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
