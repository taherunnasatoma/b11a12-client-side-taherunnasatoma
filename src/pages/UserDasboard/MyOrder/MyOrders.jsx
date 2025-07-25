import React from 'react';

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg animate-pulse">Loading payment history...</p>
      </div>
    );

  return (
    <div className="p-4 max-w-full mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Payment History
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">No payment history found.</p>
      ) : (
        // This wrapper enables horizontal scrolling on small screens
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full min-w-[900px] border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                  #
                </th>
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                  Items
                </th>
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                  Total
                </th>
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="py-3 px-3 border-b border-gray-200 text-gray-700 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 border-b border-gray-200 text-gray-700 max-w-xs">
                    <ul className="list-disc pl-5 space-y-1 text-sm max-h-28 overflow-y-auto">
                      {order.items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="truncate"
                          title={`${item.itemName} × ${item.quantity}`}
                        >
                          {item.itemName} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-3 border-b border-gray-200 font-semibold text-gray-800 whitespace-nowrap">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td
                    className="py-3 px-3 border-b border-gray-200 text-blue-600 underline cursor-pointer max-w-xs truncate whitespace-nowrap"
                    title={order.transactionId}
                  >
                    {order.transactionId}
                  </td>
                  <td
                    className={`py-3 px-3 border-b border-gray-200 font-semibold capitalize whitespace-nowrap ${
                      order.status === 'paid'
                        ? 'text-green-600'
                        : order.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.status}
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

export default MyOrders;
