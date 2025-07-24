import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useSellerPayments = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sellerPayments', user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
    const res = await axiosSecure.get(`/seller/payments?sellerEmail=${user.email}`);
      return res.data; // expected array of payments
    },
  });

  return { payments: data || [], isLoading, error, refetch };
};

export default useSellerPayments;
