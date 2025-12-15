import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Cart() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', minHeight: '60vh', textAlign: 'center' }}>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
