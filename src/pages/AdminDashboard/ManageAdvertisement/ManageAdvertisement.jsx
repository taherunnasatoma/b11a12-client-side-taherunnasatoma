import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageAdvertisement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['allAdvertisements'],
    queryFn: async () => {
      const res = await axiosSecure.get('/advertisements');
      return res.data;
    },
  });

  const toggleAdStatus = useMutation({
    mutationFn: async (ad) => {
      const newStatus = ad.status === 'approved' ? 'pending' : 'approved';
      return axiosSecure.patch(`/advertisements/${ad._id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allAdvertisements']);
      Swal.fire('Success!', 'Ad status updated.', 'success');
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Advertisements</h2>

      {isLoading ? (
        <p>Loading advertisements...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad._id} className="border rounded p-4 shadow">
              <img src={ad.image} alt="medicine" className="w-full h-40 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-2">{ad.medicineName}</h3>
              <p className="text-gray-700">{ad.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Seller Email:</strong> {ad.sellerEmail}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className={`badge ${ad.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                  {ad.status}
                </span>
                <button
                  onClick={() => toggleAdStatus.mutate(ad)}
                  className={`btn btn-sm ${ad.status === 'approved' ? 'btn-error' : 'btn-success'}`}
                >
                  {ad.status === 'approved' ? 'Remove from Slide' : 'Add to Slide'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisement;
