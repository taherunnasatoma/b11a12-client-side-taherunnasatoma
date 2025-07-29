// Testimonials.jsx
import React from 'react';

const testimonials = [
  {
    name: "Mitu Akter",
    comment: "The delivery was so fast! I got my mom's medicine in just one day. Very reliable platform.",
    image: "https://i.ibb.co/xcYRZ3j/5.jpg",
  },
  {
    name: "Raihan Islam",
    comment: "I love the discounts! Got 20% off on antibiotics. Definitely ordering again.",
    image: "https://i.ibb.co/sJp3kjy6/3.png",
  },
  {
    name: "Dr. Tanvir Ahmed",
    comment: "Great interface and trusted sellers. I recommend it to my patients too.",
    image: "https://i.ibb.co/d09sQZSC/1.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-12 rounded-2xl mb-6">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 px-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 italic">“{t.comment}”</p>
            <p className="mt-3 font-semibold text-[#82b440]">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
