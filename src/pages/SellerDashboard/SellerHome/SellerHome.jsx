import React from 'react';
import useSellerPayments from '../../../hooks/useSellerPayments';

const SellerHome = () => {
  const { payments, isLoading, error } = useSellerPayments();

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading payments</p>;

  const paidPayments = payments.filter(payment => payment.status === 'paid');
  const totalPaidRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidOrders = paidPayments.length;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your paid sales and orders</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Total Paid Revenue Card */}
        <article className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Paid Revenue</h2>
          <p className="text-5xl font-bold text-green-600">${totalPaidRevenue.toFixed(2)}</p>
        </article>

        {/* Total Paid Orders Card */}
        <article className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Paid Orders</h2>
          <p className="text-5xl font-bold text-blue-600">{totalPaidOrders}</p>
        </article>
      </section>
    </main>
  );
};

export default SellerHome;
