import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '4rem 2rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Us</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
            Have questions? We'd love to hear from you.
          </p>
          <div style={{ 
            padding: '2rem', 
            backgroundColor: '#f8f7f4', 
            borderRadius: '12px'
          }}>
            <p style={{ marginBottom: '1rem' }}><strong>Email:</strong> support@leafy.com</p>
            <p style={{ marginBottom: '1rem' }}><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Hours:</strong> Mon-Fri, 9am-6pm EST</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
