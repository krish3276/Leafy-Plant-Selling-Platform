import { Link } from 'react-router-dom';
import './Hero.css';
import hero1 from '../imgs/hero1.png';

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
          <img src={hero1} 
            alt="Monstera plant in white pot"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
