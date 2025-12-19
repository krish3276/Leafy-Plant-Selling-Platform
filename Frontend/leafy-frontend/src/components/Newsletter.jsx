import React from 'react';
import './Newsletter.css';

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <h2 className="newsletter-title">Join Our Community</h2>
        <p className="newsletter-description">
          Get 10% off your first order and stay up to date with the latest plant care tips,
          new arrivals and special offers.
        </p>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Coming soon!'); }}>
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-button">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
