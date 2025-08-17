import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-sales-summary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/payments'); // all payments
      return res.data;
    }
  });

  if (isLoading) return <p className="p-4">Loading...</p>;

  const totalOrders = payments.length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const paidOrders = payments.filter(p => p.status === 'paid').length;
  const pendingOrders = payments.filter(p => p.status === 'pending').length;

  // Monthly revenue data
  const monthlyRevenue = {};
  payments.forEach(payment => {
    const month = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
    monthlyRevenue[month] += payment.amount;
  });
  const revenueData = Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount }));

  const pieData = [
    { name: 'Paid Orders', value: paidOrders },
    { name: 'Pending Orders', value: pendingOrders },
  ];
  const COLORS = ['#82b440', '#f59e0b'];

  return (
    <div className="p-4 space-y-8">
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

      {/* Monthly Revenue Bar Chart */}
      <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#82b440" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Orders Status Pie Chart */}
      <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Orders Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AdminHome;
