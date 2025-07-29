import React from 'react';
import CategorySection from './Category/CategorySection';
import Banner from '../Banner/Banner';
import DiscountProducts from '../DiscountProducts/DiscountProducts';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import Testimonials from './Testimonials/Testimonials';


const Home = () => {
  return (
    <div>
      <Banner />
      <div className="max-w-7xl mx-auto px-4">
        <CategorySection />
        <DiscountProducts></DiscountProducts>
        <WhyChooseUs></WhyChooseUs>
        <Testimonials></Testimonials>
      </div>
    </div>
  );
};

export default Home;
