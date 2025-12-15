import { Truck, BookOpen, Leaf } from 'lucide-react';
import './WhyShop.css';

function WhyShop() {
  const benefits = [
    {
      id: 1,
      icon: <Truck size={40} />,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders over $50'
    },
    {
      id: 2,
      icon: <BookOpen size={40} />,
      title: 'Expert Care Guides',
      description: 'Access detailed guides to help your plants thrive'
    },
    {
      id: 3,
      icon: <Leaf size={40} />,
      title: '100% Organic',
      description: 'All our plants are grown with organic, pest-free soil'
    }
  ];

  return (
    <section className="why-shop">
      <div className="why-container">
        <h2 className="section-title">Why Shop With Us?</h2>
        <p className="why-subtitle">
          We provide the best quality plants and services to make your plant parenting journey a joy
        </p>
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyShop;
