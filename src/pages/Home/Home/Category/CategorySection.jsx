import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';


const CategorySection = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/categories');
      return res.data;
    },
  });

  return (
    <div className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Explore Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.slice(0, 6).map(cat => (
          <div
            key={cat._id}
            onClick={() => navigate(`/category/${cat.name}`)}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:scale-105 transition"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover rounded" />
            <h3 className="mt-2 text-xl font-semibold text-center">{cat.name}</h3>
            <p className="text-center text-sm text-gray-600">Click to see medicines</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
