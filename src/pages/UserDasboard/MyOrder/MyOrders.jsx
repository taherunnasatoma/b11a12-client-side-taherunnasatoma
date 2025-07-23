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

  if (isLoading) return <p className='text-center'>Loading History...</p>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Payment History</h2>
      {orders.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <table className='w-full table-auto border'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>#</th>
              <th className='p-2 border'>Items</th>
              <th className='p-2 border'>Total</th>
              <th className='p-2 border'>Transaction ID</th>
              <th className='p-2 border'>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td className='p-2 border'>{index + 1}</td>
                <td className='p-2 border'>
                  <ul className='list-disc pl-4'>
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.itemName} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className='p-2 border'>${order.totalAmount}</td>
                <td className='p-2 border'>{order.transactionId}</td>
                <td className='p-2 border capitalize'>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
