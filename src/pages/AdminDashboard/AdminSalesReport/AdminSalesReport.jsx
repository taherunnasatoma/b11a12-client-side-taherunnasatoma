import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminSalesReport = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(() => navigate('/forbidden'));

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-sales-report'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/payments');
      return res.data;
    },
  });

  const filtered = payments
    .filter((payment) => {
      if (!fromDate || !toDate) return true;
      const paidAt = new Date(payment.paidAt);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return paidAt >= from && paidAt <= to;
    })
    .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SalesReport');
    XLSX.writeFile(wb, 'SalesReport.xlsx');
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">📊 Admin Sales Report</h2>

      {/* Filter + Export Section */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <CSVLink
            data={filtered}
            filename="SalesReport.csv"
            className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
          >
            Export CSV
          </CSVLink>
        </div>
        <div className="flex items-end">
          <button
            onClick={downloadExcel}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto rounded border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">Invoice</th>
              <th className="px-4 py-3 border">Buyer Email</th>
              <th className="px-4 py-3 border">Seller(s)</th>
              <th className="px-4 py-3 border">Medicine(s)</th>
              <th className="px-4 py-3 border">Total Price</th>
              <th className="px-4 py-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border">{payment.invoiceNumber}</td>
                <td className="px-4 py-3 border">{payment.userEmail}</td>
                <td className="px-4 py-3 border">
                  {payment.items.map((item) => item.sellerEmail).join(', ')}
                </td>
                <td className="px-4 py-3 border space-y-1">
                  {payment.items.map((item) => (
                    <div key={item._id}>
                      <span className="font-medium">{item.name}</span> ({item.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 border text-green-600 font-semibold">${payment.amount}</td>
                <td className="px-4 py-3 border">
                  {new Date(payment.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No records found in the selected date range.</p>
      )}
    </div>
  );
};

export default AdminSalesReport;
