import React from 'react';
import { Leaf, Heart, Award, Users, Sprout, Zap, BookOpen } from 'lucide-react';
import '../styles/About.css';

function About() {
  const whyChooseUs = [
    {
      id: 1,
      icon: <Award size={40} />,
      title: 'Premium Quality Plants',
      description: 'We carefully select and nurture each plant to ensure they arrive at your doorstep healthy and vibrant, ready to thrive in your home.'
    },
    {
      id: 2,
      icon: <Leaf size={40} />,
      title: 'Expert Care Support',
      description: 'Our AI-powered plant care guides and expert tips help you become a successful plant parent, no matter your experience level.'
    },
    {
      id: 3,
      icon: <Heart size={40} />,
      title: 'Eco-Friendly Practices',
      description: 'We are committed to sustainability with organic soil, biodegradable packaging, and responsible sourcing of all our plants.'
    },
    {
      id: 4,
      icon: <Users size={40} />,
      title: 'Community Support',
      description: 'Join our growing community of plant enthusiasts. Share your experiences, get advice, and celebrate your green space journey with us.'
    }
  ];

  const whatWeProvide = [
    {
      id: 1,
      icon: <Sprout size={32} />,
      title: 'Wide Plant Selection',
      description: 'From low-maintenance succulents to elegant tropical plants, we offer diverse species for every space and skill level.'
    },
    {
      id: 2,
      icon: <Zap size={32} />,
      title: 'Fast & Safe Delivery',
      description: 'Quick shipping with special packaging to ensure your plants arrive in perfect condition, safely protected during transit.'
    },
    {
      id: 3,
      icon: <BookOpen size={32} />,
      title: 'Comprehensive Guides',
      description: 'Detailed care instructions, watering schedules, and troubleshooting tips for every plant species we offer.'
    },
    {
      id: 4,
      icon: <Award size={32} />,
      title: 'Quality Guarantee',
      description: 'We stand behind our products with a satisfaction guarantee. If your plant doesn\'t thrive, we\'re here to help.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Welcome to Leafy</h1>
          <p className="about-hero-subtitle">
            Bringing Nature Into Your Home, One Plant at a Time
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="company-story">
        <div className="story-container">
          <div className="story-content">
            <h2 className="section-title">Our Story</h2>
            <p className="story-paragraph">
              Leafy was born from a simple passion: making plant parenting accessible and enjoyable for everyone. 
              We believe that plants have the power to transform spaces, improve air quality, and bring joy into our daily lives.
            </p>
            <p className="story-paragraph">
              Starting as a small plant nursery, we've grown into a trusted online platform dedicated to connecting 
              plant lovers with carefully curated, healthy specimens. Today, we're proud to serve thousands of happy plant parents 
              across the region, helping them build thriving green spaces in their homes and offices.
            </p>
            <p className="story-paragraph">
              With our innovative AI-powered care guidance and expert support, we're not just selling plants – 
              we're building a community of nature enthusiasts committed to sustainable living and plant wellness.
            </p>
          </div>
          <div className="story-image">
            <div className="story-image-placeholder">
              <svg className="growing-plant" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                {/* Soil */}
                <ellipse cx="100" cy="240" rx="60" ry="15" fill="#8B7355" opacity="0.8" />
                <rect x="40" y="240" width="120" height="30" fill="#A0826D" opacity="0.6" />
                
                {/* Main Stem */}
                <line x1="100" y1="240" x2="100" y2="140" stroke="#4CAF50" strokeWidth="4" className="stem" strokeLinecap="round" />
                
                {/* Left Branch 1 */}
                <g className="branch branch-1">
                  <line x1="100" y1="180" x2="70" y2="160" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="65" cy="155" rx="8" ry="12" fill="#81C784" opacity="0.9" />
                  <ellipse cx="62" cy="148" rx="7" ry="10" fill="#81C784" opacity="0.85" />
                </g>
                
                {/* Right Branch 1 */}
                <g className="branch branch-2">
                  <line x1="100" y1="180" x2="130" y2="160" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="135" cy="155" rx="8" ry="12" fill="#81C784" opacity="0.9" />
                  <ellipse cx="138" cy="148" rx="7" ry="10" fill="#81C784" opacity="0.85" />
                </g>
                
                {/* Left Branch 2 */}
                <g className="branch branch-3">
                  <line x1="100" y1="160" x2="65" y2="140" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="60" cy="135" rx="8" ry="12" fill="#66BB6A" opacity="0.95" />
                  <ellipse cx="55" cy="128" rx="7" ry="10" fill="#81C784" opacity="0.9" />
                  <ellipse cx="58" cy="122" rx="6" ry="9" fill="#81C784" opacity="0.85" />
                </g>
                
                {/* Right Branch 2 */}
                <g className="branch branch-4">
                  <line x1="100" y1="160" x2="135" y2="140" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="140" cy="135" rx="8" ry="12" fill="#66BB6A" opacity="0.95" />
                  <ellipse cx="145" cy="128" rx="7" ry="10" fill="#81C784" opacity="0.9" />
                  <ellipse cx="142" cy="122" rx="6" ry="9" fill="#81C784" opacity="0.85" />
                </g>
                
                {/* Top Leaves */}
                <g className="branch branch-5">
                  <ellipse cx="90" cy="130" rx="9" ry="14" fill="#4CAF50" opacity="0.95" transform="rotate(-35 90 130)" />
                  <ellipse cx="110" cy="130" rx="9" ry="14" fill="#4CAF50" opacity="0.95" transform="rotate(35 110 130)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose">
        <div className="why-container">
          <h2 className="section-title">Why Choose Leafy?</h2>
          <p className="why-subtitle">
            Experience the difference of working with plant experts who genuinely care about your success
          </p>
          <div className="why-grid">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="what-we-provide">
        <div className="provide-container">
          <h2 className="section-title">What We Provide</h2>
          <p className="provide-subtitle">
            Everything you need to start and succeed in your plant parenting journey
          </p>
          <div className="provide-grid">
            {whatWeProvide.map((item) => (
              <div key={item.id} className="provide-card">
                <div className="provide-icon">{item.icon}</div>
                <h3 className="provide-title">{item.title}</h3>
                <p className="provide-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="mission-values">
        <div className="mission-container">
          <h2 className="section-title">Our Mission & Values</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <h3 className="mission-heading">🌱 Our Mission</h3>
              <p className="mission-text">
                To empower plant lovers with premium quality plants, expert knowledge, and community support, 
                making it easy for everyone to create beautiful, thriving green spaces in their homes and workplaces.
              </p>
            </div>
            <div className="mission-card">
              <h3 className="mission-heading">💚 Our Values</h3>
              <ul className="values-list">
                <li><strong>Quality:</strong> We offer only the healthiest, most vibrant plants</li>
                <li><strong>Sustainability:</strong> Eco-friendly practices in every step</li>
                <li><strong>Expertise:</strong> Sharing knowledge to help you succeed</li>
                <li><strong>Community:</strong> Building connections among plant enthusiasts</li>
                <li><strong>Transparency:</strong> Honest information about our products and services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-number">5K+</h3>
            <p className="stat-label">Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Plant Varieties</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Organic & Healthy</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Expert Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Green Journey?</h2>
          <p className="cta-subtitle">
            Browse our collection and find the perfect plants for your space
          </p>
          <a href="/shop" className="cta-button">Explore Our Plants</a>
        </div>
      </section>
    </div>
  );
}

export default About;
