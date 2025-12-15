import { Link } from 'react-router-dom';
import './PopularPicks.css';

function PopularPicks() {
  const products = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Snake Plant',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1593482892540-73c6eb07a650?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 34.00,
      image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Golden Pothos',
      price: 19.00,
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop'
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
