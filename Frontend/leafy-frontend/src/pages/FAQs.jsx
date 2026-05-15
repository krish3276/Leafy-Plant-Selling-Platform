import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle, Leaf, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import '../styles/FAQs.css';

const faqs = [
  {
    category: 'Orders',
    icon: <Truck size={18} />,
    question: 'How long does delivery take?',
    answer:
      'Most orders are delivered within 3-5 business days depending on your location. You will receive a tracking update once your order is dispatched.',
  },
  {
    category: 'Orders',
    icon: <Truck size={18} />,
    question: 'Can I change my delivery address after placing an order?',
    answer:
      'If your order has not been shipped yet, contact us as soon as possible and we will try to update the delivery details for you.',
  },
  {
    category: 'Plants',
    icon: <Leaf size={18} />,
    question: 'How do I care for my new plant after delivery?',
    answer:
      'Keep the plant in indirect sunlight for the first few days, water lightly if the soil feels dry, and avoid repotting immediately after arrival.',
  },
  {
    category: 'Plants',
    icon: <Leaf size={18} />,
    question: 'Do you sell indoor and outdoor plants?',
    answer:
      'Yes. We have a curated collection of indoor plants, outdoor plants, succulents, and plant care accessories.',
  },
  {
    category: 'Payments',
    icon: <CreditCard size={18} />,
    question: 'What payment methods do you accept?',
    answer:
      'We accept major debit and credit cards, UPI payments, and other standard online payment methods supported at checkout.',
  },
  {
    category: 'Payments',
    icon: <CreditCard size={18} />,
    question: 'Will I get a refund if an item is out of stock?',
    answer:
      'Yes. If an item becomes unavailable before shipment, we will cancel that item and process a refund according to your payment method.',
  },
  {
    category: 'Support',
    icon: <ShieldCheck size={18} />,
    question: 'Are my payments and account details secure?',
    answer:
      'Yes. Your account information is protected and payment flows are handled securely through the checkout process.',
  },
  {
    category: 'Support',
    icon: <MessageCircle size={18} />,
    question: 'How can I contact support?',
    answer:
      'You can use the contact form on the Contact page for any order, product, or plant care related questions.',
  },
];

function FAQs() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFaq = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <div className="faqs-page">
      <section className="faqs-hero">
        <div className="faqs-hero-content">
          <div className="faqs-hero-badge">
            <HelpCircle size={18} />
            Help Center
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>
            Quick answers about delivery, payments, plant care, and support for your leafy shopping experience.
          </p>
          <div className="faqs-hero-actions">
            <Link to="/shop" className="faqs-primary-btn">Browse Plants</Link>
            <Link to="/contact" className="faqs-secondary-btn">Contact Support</Link>
          </div>
        </div>
      </section>

      <section className="faqs-content">
        <div className="faqs-list">
          {faqs.map((faq, index) => (
            <article key={faq.question} className={`faq-card ${openIndex === index ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-question-meta">
                  <span className="faq-icon">{faq.icon}</span>
                  <span className="faq-question-text">
                    <span className="faq-category">{faq.category}</span>
                    <span className="faq-title">{faq.question}</span>
                  </span>
                </span>
                <ChevronDown size={20} className="faq-chevron" />
              </button>

              <div className="faq-answer-wrap" aria-hidden={openIndex !== index}>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQs;
