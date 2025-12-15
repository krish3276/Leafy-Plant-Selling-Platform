import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Shop() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', minHeight: '60vh', textAlign: 'center' }}>
        <h1>Shop All Plants</h1>
        <p>Coming soon - Browse our full collection of plants</p>
      </div>
      <Footer />
    </div>
  );
}

export default Shop;
