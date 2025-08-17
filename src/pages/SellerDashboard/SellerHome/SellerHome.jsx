import React from 'react';
import useSellerPayments from '../../../hooks/useSellerPayments';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SellerHome = () => {
  const { payments, isLoading, error } = useSellerPayments();

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading payments</p>;

  const paidPayments = payments.filter(payment => payment.status === 'paid');
  const totalPaidRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidOrders = paidPayments.length;

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPendingOrders = pendingPayments.length;

  // Prepare monthly revenue data
  const monthlyRevenue = {};
  payments.forEach(payment => {
    const month = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
    monthlyRevenue[month] += payment.amount;
  });

  const revenueData = Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount }));

  // Pie chart data
  const pieData = [
    { name: 'Paid Orders', value: totalPaidOrders },
    { name: 'Pending Orders', value: totalPendingOrders },
  ];
  const COLORS = ['#82b440', '#f59e0b'];

  return (
    <main className="  p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your sales and orders</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <article className="bg-[#82b440] shadow-md rounded-lg p-6 flex flex-col justify-center items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-white mb-2">Total Paid Revenue</h2>
          <p className="text-5xl font-bold text-white">${totalPaidRevenue.toFixed(2)}</p>
        </article>

        <article className="bg-[#82b440] shadow-md rounded-lg p-6 flex flex-col justify-center items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-white mb-2">Total Paid Orders</h2>
          <p className="text-5xl font-bold text-white">{totalPaidOrders}</p>
        </article>
      </section>

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
    </main>
  );
};

export default SellerHome;
