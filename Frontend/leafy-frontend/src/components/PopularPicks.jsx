import { Link } from 'react-router-dom';
import './PopularPicks.css';
import picks1 from '../imgs/picks1.png';
import picks2 from '../imgs/picks2.png';
import picks3 from '../imgs/picks3.png';
import picks4 from '../imgs/picks4.png';

function PopularPicks() {
  const products = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 25.00,
      image: picks1
    },
    {
      id: 2,
      name: 'Snake Plant',
      price: 22.00,
      image: picks2
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 34.00,
      image: picks3
    },
    {
      id: 4,
      name: 'Golden Pothos',
      price: 19.00,
      image: picks4
    }
  ];

  return (
    <section className="popular-picks">
      <div className="popular-container">
        <h2 className="section-title">Our Popular Picks</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularPicks;
