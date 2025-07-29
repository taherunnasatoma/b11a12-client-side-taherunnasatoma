import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-sales-summary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/payments'); // paid ones
      return res.data;
    }
  });

  const totalOrders = payments.length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Total Orders</h3>
          <p className="text-3xl">{totalOrders}</p>
        </div>
        <div className="bg-[#82b440] text-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="text-3xl">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Admin Email</h3>
          <p className="text-md mt-2">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
