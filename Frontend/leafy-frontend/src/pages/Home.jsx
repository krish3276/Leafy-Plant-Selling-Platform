import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedCategories from '../components/FeaturedCategories';
import PopularPicks from '../components/PopularPicks';
import WhyShop from '../components/WhyShop';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <PopularPicks />
      <WhyShop />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Home;
