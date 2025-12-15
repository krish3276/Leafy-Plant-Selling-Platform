import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Account() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', minHeight: '60vh', textAlign: 'center' }}>
        <h1>My Account</h1>
        <p>Login/Register functionality coming soon</p>
      </div>
      <Footer />
    </div>
  );
}

export default Account;
