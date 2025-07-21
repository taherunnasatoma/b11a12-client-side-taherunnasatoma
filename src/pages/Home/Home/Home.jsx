import React from 'react';
import CategorySection from './Category/CategorySection';
import Banner from '../Banner/Banner';


const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
             <Banner></Banner>
          <CategorySection></CategorySection>
          
        </div>
    );
};

export default Home;