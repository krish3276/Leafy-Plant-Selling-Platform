import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { cartAPI } from '../utils/api';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await cartAPI.getCart();
      if (response.success && response.cart) {
        const totalItems = response.cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
    
    // Fetch cart count if logged in
    if (authToken) {
      fetchCartCount();
    }

    // Listen for cart updates
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
      if (token) {
        fetchCartCount();
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="logo-icon">🪴</span>
          <span className="logo-text">Leafy</span>
        </Link>

        {/* Search Bar - Hidden on very small screens */}
        <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for plants..."
            className="search-input"
            onBlur={() => setIsSearchOpen(false)}
          />
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <div className="nav-dropdown">
            <Link to="/shop" className="nav-link">Shop</Link>
            <div className="dropdown-content">
              <Link to="/shop/indoor" onClick={() => setIsMobileMenuOpen(false)}>Indoor Plants</Link>
              <Link to="/shop/outdoor" onClick={() => setIsMobileMenuOpen(false)}>Outdoor Plants</Link>
              <Link to="/shop/succulents" onClick={() => setIsMobileMenuOpen(false)}>Succulents</Link>
            </div>
          </div>
          <Link to="/plant-care" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Plant Care</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          <button 
            className="search-toggle-mobile" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <Search size={22} />
          </button>
          <Link to="/cart" className="icon-link cart-icon-wrapper">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>
          <Link to={isLoggedIn ? "/account" : "/login"} className="icon-link">
            <User size={22} />
          </Link>
          <Link to="/admin/login" className="admin-link" title="Admin Portal">
            🔐
          </Link>

          {/* Hamburger Menu - Visible only on mobile */}
          <button
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <div className="mobile-nav-dropdown">
              <Link to="/shop" className="mobile-nav-link">Shop</Link>
              <div className="mobile-dropdown-content">
                <Link to="/shop/indoor" onClick={() => setIsMobileMenuOpen(false)}>
                  Indoor Plants
                </Link>
                <Link to="/shop/outdoor" onClick={() => setIsMobileMenuOpen(false)}>
                  Outdoor Plants
                </Link>
                <Link to="/shop/succulents" onClick={() => setIsMobileMenuOpen(false)}>
                  Succulents
                </Link>
              </div>
            </div>
            <Link to="/plant-care" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Plant Care
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
