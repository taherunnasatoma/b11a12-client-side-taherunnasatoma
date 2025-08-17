import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const UserHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['user-orders', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="p-4">Loading...</p>;

  // Summary data
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Monthly spending
  const monthlySpending = {};
  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlySpending[month]) monthlySpending[month] = 0;
    monthlySpending[month] += order.totalAmount;
  });
  const spendingData = Object.entries(monthlySpending).map(([month, total]) => ({ month, total }));

  const pieData = [
    { name: 'Paid', value: paidOrders },
    { name: 'Pending', value: pendingOrders },
  ];
  const COLORS = ['#82b440', '#facc15'];

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="p-4 space-y-8 ">

      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{totalOrders}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Paid Orders</h3>
          <p className="text-2xl">{paidOrders}</p>
        </div>
        <div className="bg-yellow-400 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-2xl">{pendingOrders}</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Spent</h3>
          <p className="text-2xl">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={spendingData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#82b440" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Orders Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p>No recent orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border-b">#</th>
                  <th className="px-3 py-2 border-b">Items</th>
                  <th className="px-3 py-2 border-b">Total</th>
                  <th className="px-3 py-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="px-3 py-2 border-b">{i + 1}</td>
                    <td className="px-3 py-2 border-b">
                      {order.items?.map(item => `${item.itemName} × ${item.quantity}`).join(', ')}
                    </td>
                    <td className="px-3 py-2 border-b">${order.totalAmount.toFixed(2)}</td>
                    <td className={`px-3 py-2 border-b font-semibold ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserHome;
