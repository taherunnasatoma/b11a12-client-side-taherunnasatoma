// WhyChooseUs.jsx
import React from 'react';
import { ShieldCheck, Truck, Star, Activity } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="text-[#82b440]  w-8 h-8" />,
    title: 'Authentic Medicines',
    desc: 'We source directly from verified pharmaceutical companies.',
  },
  {
    icon: <Truck className="text-[#82b440]  w-8 h-8" />,
    title: 'Fast Delivery',
    desc: 'Get your medicines delivered within 24-48 hours.',
  },
  {
    icon: <Star className="text-[#82b440]  w-8 h-8" />,
    title: 'Top Rated Sellers',
    desc: 'We feature only trusted and rated sellers on our platform.',
  },
  {
    icon: <Activity className="text-[#82b440] w-8 h-8" />,
    title: 'Secure Payments',
    desc: 'Stripe-secured checkout with full encryption and safety.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl bg-gray-50 mb-6 rounded-2xl  mx-auto mt-4 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
      <div className=" max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition">
            <div className="flex justify-center mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
