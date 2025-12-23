import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PopularPicks.css';
import { productAPI } from '../utils/api';

function PopularPicks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({ sort: 'newest' });
      
      if (response.success) {
        // Get only first 4 products for Popular Picks
        setProducts(response.products.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching popular products:', error);
      // Fallback to empty array if fetch fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="popular-picks">
        <div className="popular-container">
          <h2 className="section-title">Our Popular Picks</h2>
          <div className="loading-message">Loading products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="popular-picks">
        <div className="popular-container">
          <h2 className="section-title">Our Popular Picks</h2>
          <p className="no-products-message">No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-picks">
      <div className="popular-container">
        <h2 className="section-title">Our Popular Picks</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/shop" className="view-all-btn">
            View All Plants →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PopularPicks;
