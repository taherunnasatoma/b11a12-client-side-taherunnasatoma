import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Sample test data
const sampleDiscountedProducts = [
  {
    _id: '1',
    itemName: 'MaxPro Tablet',
    genericName: 'Paracetamol',
    price: 120,
    discount: 20,
    image: 'https://i.ibb.co/21MsnNh1/maxpro-20-mg-capsule-41246950311-i1-9-S8t9-ZM6-G0-ND0-RHSYWU7.jpg',
  },
  {
 _id: '2',
  itemName: 'Seclo 20',
  genericName: 'Omeprazole',
  price: 110,
  discount: 10,
  image: 'https://i.ibb.co/dJ2vbTZr/s.jpg'
  },
  {
    _id: '3',
    itemName: 'Histacin Syrup',
    genericName: 'Chlorpheniramine',
    price: 90,
    discount: 10,
    image: 'https://i.ibb.co/twBjXzmq/histacin-2-mg-syrup-78062336569-i1-ZEQ22-QYGNbh-Hs-ZOl-CUFc.webp',
  },
];

const DiscountProducts = () => {
  const discountedProducts = sampleDiscountedProducts;

  return (
    <section className="bg-gray-50 rounded-2xl mb-6 discount-products-section p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mt-6 mb-6 text-center">Discounted Products</h2>
      {discountedProducts.length === 0 ? (
        <p>No discounted products available.</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {discountedProducts.map(product => (
      <SwiperSlide
  key={product._id}
  className="bg-white m-6  p-4 rounded-lg shadow-md"
>
  <img
    src={product.image}
    alt={product.itemName}
    className="w-full h-auto max-h-60 object-contain rounded"
  />
  <h3 className="mt-2 text-lg font-medium">{product.itemName}</h3>
  <p className="text-sm text-gray-600">{product.genericName}</p>
  <p className="mt-1 text-gray-800 font-semibold">
    Price:{' '}
    <span className="line-through text-red-500">${product.price}</span>{' '}
    <span className="text-[#82b440] font-bold">
      ${(
        product.price *
        (1 - product.discount / 100)
      ).toFixed(2)}
    </span>
  </p>
  <p className="text-sm text-blue-600">
    Discount: {product.discount}% off
  </p>
</SwiperSlide>

          ))}
        </Swiper>
      )}
    </section>
  );
};

export default DiscountProducts;
