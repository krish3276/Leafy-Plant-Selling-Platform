import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🪴</span>
          <span className="logo-text">Leafy</span>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for plants..."
            className="search-input"
          />
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <div className="nav-dropdown">
            <Link to="/shop" className="nav-link">Shop</Link>
            <div className="dropdown-content">
              <Link to="/shop/indoor">Indoor Plants</Link>
              <Link to="/shop/outdoor">Outdoor Plants</Link>
              <Link to="/shop/succulents">Succulents</Link>
            </div>
          </div>
          <Link to="/plant-care" className="nav-link">Plant Care</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          <Link to="/cart" className="icon-link">
            <ShoppingCart size={22} />
          </Link>
          <Link to={isLoggedIn ? "/account" : "/login"} className="icon-link">
            <User size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
