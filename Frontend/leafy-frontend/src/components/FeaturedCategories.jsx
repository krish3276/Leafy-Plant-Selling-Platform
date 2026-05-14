import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCategories.css';
import cat1 from '../imgs/indoor.png';
import cat2 from '../imgs/outdoor.jpg';
import cat3 from '../imgs/succulent .png';
import cat4 from '../imgs/tools.png';


function FeaturedCategories() {
  const categories = [
    {
      id: 1,
      title: 'Indoor Plants',
      description: 'Perfect for any room',
      image: cat1,
      link: '/shop/indoor'
    },
    {
      id: 2,
      title: 'Outdoor Plants',
      description: 'For your garden or patio',
      image: cat2,
      link: '/shop/outdoor'
    },
    {
      id: 3,
      title: 'Succulents',
      description: 'Low maintenance beauties',
      image: cat3,
      link: '/shop/succulents'
    },
    {
      id: 4,
      title: 'Plant Care',
      description: 'Tools and accessories',
      image: cat4,
      link: '/shop/accessories'
    }
  ];

  return (
    <section className="featured-categories">
      <div className="featured-container">
        <h2 className="section-title">Featured Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link to={category.link} key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.title} />
              </div>
              <div className="category-info">
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;
