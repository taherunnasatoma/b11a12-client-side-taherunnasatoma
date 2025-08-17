import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => {
  const { data: bannerAds = [] } = useQuery({
    queryKey: ['bannerAds'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/advertisements/banner');
      return res.data;
    },
  });

  return (
    <section className="w-full">
  <h2 className="text-3xl font-bold text-center mt-8 mb-6">Featured Medicines</h2>

  <div className="w-full h-[70vh] bg-black flex items-center justify-center">
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      loop={true}
      className="w-full h-full"
    >
      {bannerAds.map((ad) => (
     <SwiperSlide key={ad._id}>
  <div className="w-full h-[80vh] relative overflow-hidden">
    <img
      src={ad.image}
      alt={ad.medicineName}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white w-full px-4 py-4">
      <h3 className="text-xl sm:text-2xl font-semibold">{ad.medicineName}</h3>
    </div>
  </div>
</SwiperSlide>



      ))}
    </Swiper>
  </div>
</section>

  );
};

export default Banner;
