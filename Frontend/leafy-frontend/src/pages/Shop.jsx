import React, { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';
import '../styles/Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest',
  });

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

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
    setFilters({ ...filters, category: category === filters.category ? '' : category });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const addToCart = (productId) => {
    // TODO: Implement cart functionality
    alert('Product added to cart! (Cart functionality coming soon)');
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
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.stock === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="low-stock-badge">Only {product.stock} left!</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
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
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
