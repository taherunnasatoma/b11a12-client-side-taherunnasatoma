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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sales Report</h2>

      {/* Filter + Export Options */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div>
          <label className="block mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <CSVLink
          data={filtered}
          filename="SalesReport.csv"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export CSV
        </CSVLink>

        <button
          onClick={downloadExcel}
          className="bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>

       
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Invoice</th>
              <th className="border px-4 py-2">Buyer Email</th>
              <th className="border px-4 py-2">Seller(s)</th>
              <th className="border px-4 py-2">Medicine(s)</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment._id}>
                <td className="border px-4 py-2">{payment.invoiceNumber}</td>
                <td className="border px-4 py-2">{payment.userEmail}</td>
                <td className="border px-4 py-2">
                  {payment.items.map((item) => item.sellerEmail).join(', ')}
                </td>
                <td className="border px-4 py-2">
                  {payment.items.map((item) => (
                    <div key={item._id}>
                      <span className="font-medium">{item.name}</span> ({item.quantity})
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">${payment.amount}</td>
                <td className="border px-4 py-2">
                  {new Date(payment.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesReport;
