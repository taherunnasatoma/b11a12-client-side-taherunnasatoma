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
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.patch(`/admin/payments/${id}`);
      return data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'Payment marked as paid.', 'success');
      queryClient.invalidateQueries(['all-payments']);
    },
    onError: () => {
      Swal.fire('Error', 'Failed to approve payment.', 'error');
    },
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading payments...</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Payment Management</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">User Email</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{payment.userEmail}</td>
                <td className="px-4 py-3 font-medium text-blue-600">${payment.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">{payment.invoiceNumber}</td>
                <td className="px-4 py-3 text-center">
                  {payment.status === 'pending' ? (
                    <button
                      className="btn btn-sm bg-green-600 hover:bg-green-700 text-white transition"
                      onClick={() => approveMutation.mutate(payment._id)}
                    >
                      Accept Payment
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Paid</span>
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
