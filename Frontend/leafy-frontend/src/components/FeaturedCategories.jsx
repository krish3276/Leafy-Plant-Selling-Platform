import { Link } from 'react-router-dom';
import './FeaturedCategories.css';

function FeaturedCategories() {
  const categories = [
    {
      id: 1,
      title: 'Indoor Plants',
      description: 'Perfect for any room',
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400&h=400&fit=crop',
      link: '/shop/indoor'
    },
    {
      id: 2,
      title: 'Outdoor Plants',
      description: 'For your garden or patio',
      image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=400&fit=crop',
      link: '/shop/outdoor'
    },
    {
      id: 3,
      title: 'Succulents',
      description: 'Low maintenance beauties',
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop',
      link: '/shop/succulents'
    },
    {
      id: 4,
      title: 'Plant Care',
      description: 'Tools and accessories',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop',
      link: '/plant-care'
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
