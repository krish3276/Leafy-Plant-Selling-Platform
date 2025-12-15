import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Bring Nature Into<br />Your Home
          </h1>
          <p className="hero-description">
            Discover a wide variety of beautiful and healthy plants to liven up your
            space. Freshness guaranteed.
          </p>
          <Link to="/shop/indoor" className="hero-button">
            Shop Indoor Plants
          </Link>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop" 
            alt="Monstera plant in white pot"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
