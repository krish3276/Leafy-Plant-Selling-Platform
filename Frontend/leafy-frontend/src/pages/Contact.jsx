import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Headphones, 
  Package,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Thank you for contacting us! We\'ll get back to you within 24 hours.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactReasons = [
    {
      icon: <MessageCircle size={32} />,
      title: 'General Inquiries',
      description: 'Questions about our plants, services, or anything else.'
    },
    {
      icon: <Headphones size={32} />,
      title: 'Customer Support',
      description: 'Need help with an order or have a plant care question?'
    },
    {
      icon: <Package size={32} />,
      title: 'Order & Shipping',
      description: 'Track your order or inquire about delivery options.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            Have a question or need assistance? We're here to help you grow your green space!
          </p>
        </div>
      </div>

      {/* Contact Reasons */}
      <div className="contact-reasons">
        <div className="reasons-container">
          {contactReasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">{reason.icon}</div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="contact-main">
        <div className="contact-container">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-title">Send Us a Message</h2>
            <p className="section-subtitle">
              Fill out the form below and we'll respond as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="plant-care">Plant Care Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              {formStatus.message && (
                <div className={`form-status ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2 className="section-title">Contact Information</h2>
            <p className="section-subtitle">
              Reach out to us through any of these channels.
            </p>

            <div className="contact-info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <div className="info-content">
                  <h4>Email Us</h4>
                  <p>support@leafy.com</p>
                  <p className="info-secondary">We reply within 24 hours</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <div className="info-content">
                  <h4>Call Us</h4>
                  <p>(555) 123-4567</p>
                  <p className="info-secondary">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-content">
                  <h4>Visit Us</h4>
                  <p>123 Green Street</p>
                  <p>Plant City, PC 12345</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <div className="info-content">
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9am - 6pm</p>
                  <p>Saturday: 10am - 4pm</p>
                  <p className="info-secondary">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={22} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={22} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={22} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Linkedin size={22} />
                </a>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="faq-box">
              <h4>Looking for Quick Answers?</h4>
              <p>Visit our FAQ section for instant solutions to common questions.</p>
              <Link to="/faqs" className="faq-link">View FAQs →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Optional) */}
      <div className="map-section">
        <div className="map-placeholder">
          <MapPin size={48} />
          <p>Map Location</p>
          <span>123 Green Street, Plant City, PC 12345</span>
        </div>
      </div>
    </div>
  );
}

export default Contact;
