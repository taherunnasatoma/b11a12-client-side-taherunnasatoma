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
      Swal.fire('Success!', 'Advertisement status updated.', 'success');
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 ">📢 Manage Advertisements</h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading advertisements...</p>
      ) : ads.length === 0 ? (
        <p className="text-center text-gray-500">No advertisements found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 border"
            >
              <img
                src={ad.image}
                alt="Medicine"
                className="w-full h-60 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{ad.medicineName}</h3>
                <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  <strong>Seller:</strong> {ad.sellerEmail}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      ad.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {ad.status}
                  </span>

                  <button
                    onClick={() => toggleAdStatus.mutate(ad)}
                    className={`btn btn-sm ${
                      ad.status === 'approved' ? 'btn-error' : 'btn-success'
                    }`}
                  >
                    {ad.status === 'approved' ? 'Remove from Slide' : 'Add to Slide'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisement;
