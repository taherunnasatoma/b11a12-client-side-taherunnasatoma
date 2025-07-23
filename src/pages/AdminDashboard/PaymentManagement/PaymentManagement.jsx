import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

 const { data: allPayments = [], isLoading } = useQuery({
  queryKey: ['all-payments'],
  queryFn: async () => {
   const res = await axiosSecure.get('/admin/payments');

    return res.data;
  }
});


  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.patch(`/admin/payments/${id}`);
      return data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'Payment marked as paid.', 'success');
      queryClient.invalidateQueries(['admin-payments']);
    },
    onError: () => {
      Swal.fire('Error', 'Failed to approve payment.', 'error');
    }
  });

  if (isLoading) return <p>Loading payments...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment Management</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.userEmail}</td>
                <td>${payment.amount}</td>
                <td className={payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                  {payment.status}
                </td>
                <td>{payment.invoiceNumber}</td>
                <td>
                  {payment.status === 'pending' ? (
                    <button
                      className="btn btn-sm bg-green-500 text-white"
                      onClick={() => approveMutation.mutate(payment._id)}
                    >
                      Accept Payment
                    </button>
                  ) : (
                    <span className="text-gray-400">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;
