import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🪴</span>
              <span className="logo-text">Leafy</span>
            </div>
            <p className="footer-description">
              Your one-stop shop for healthy, beautiful plants.
            </p>
          </div>

          {/* Shop Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li><Link to="/shop/indoor">Indoor Plants</Link></li>
              <li><Link to="/shop/outdoor">Outdoor Plants</Link></li>
              <li><Link to="/shop/succulents">Succulents</Link></li>
              <li><Link to="/plant-care">Plant Care</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div className="footer-section">
            <h3 className="footer-heading">About</h3>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 Leafy. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
