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
        <div>
            <section className="mb-10">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Medicines</h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[300px] rounded-lg"
        >
          {bannerAds.map((ad) => (
            <SwiperSlide key={ad._id}>
              <div className="w-full h-full relative">
                <img
                  src={ad.image}
                  alt={ad.medicineName}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white w-full text-center py-2">
                  <h3 className="text-xl font-semibold">{ad.medicineName}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
        </div>
    );
};

export default Banner;