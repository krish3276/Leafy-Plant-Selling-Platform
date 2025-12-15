import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Leafy</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Welcome to Leafy, your trusted partner in bringing nature into your home. 
            We're passionate about plants and committed to helping you create a thriving green space.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.8' }}>
            With our carefully curated selection of indoor and outdoor plants, combined with 
            AI-powered care guidance, we make plant parenting accessible to everyone.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
