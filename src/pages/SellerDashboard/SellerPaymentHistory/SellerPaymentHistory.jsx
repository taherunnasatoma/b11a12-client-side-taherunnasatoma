import React from 'react';
import useSellerPayments from '../../../hooks/useSellerPayments';

const SellerPaymentHistory = () => {
  const { payments, isLoading, error } = useSellerPayments();

  if (isLoading) return <p>Loading payment history...</p>;
  if (error) return <p>Error loading payment history</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Payment History for Your Medicines</h2>

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Invoice</th>
                <th className="px-4 py-2 border">Buyer Email</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Paid At</th>
                <th className="px-4 py-2 border">Medicines</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">{payment.invoiceNumber}</td>
                  <td className="px-4 py-2 border text-center">{payment.userEmail}</td>
                  <td className="px-4 py-2 border text-center">${payment.amount}</td>
                  <td className="px-4 py-2 border text-center capitalize">{payment.status}</td>
                  <td className="px-4 py-2 border text-center">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="space-y-1">
                      {payment.items?.map((item, i) => (
                        <div key={item._id || i} className="border-b pb-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600 text-xs">Quantity: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerPaymentHistory;
