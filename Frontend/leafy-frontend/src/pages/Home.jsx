import React from 'react';
import Hero from '../components/Hero';
import FeaturedCategories from '../components/FeaturedCategories';
import PopularPicks from '../components/PopularPicks';
import WhyShop from '../components/WhyShop';
import Newsletter from '../components/Newsletter';

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <PopularPicks />
      <WhyShop />
      <Newsletter />
    </div>
  );
}

export default Home;
