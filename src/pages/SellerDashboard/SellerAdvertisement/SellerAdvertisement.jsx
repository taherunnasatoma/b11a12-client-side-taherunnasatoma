import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const SellerAdvertisement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: ads = [], refetch } = useQuery({
    queryKey: ['advertisements', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/advertisements?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', image);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setImageURL(data.data.url);
      } else {
        Swal.fire('Image upload failed', '', 'error');
      }
    } catch (error) {
      Swal.fire('Upload error', error.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (isUploading) {
      Swal.fire('Please wait', 'Image is still uploading.', 'info');
      return;
    }

    if (!medicineName || !description || !imageURL) {
      Swal.fire('All fields are required', '', 'error');
      return;
    }

    const newAd = {
      sellerEmail: user.email,
      medicineName,
      description,
      image: imageURL,
    };

    const res = await axiosSecure.post('/advertisements', newAd);
    if (res.data.insertedId) {
      Swal.fire('Advertisement submitted!', 'Pending admin review.', 'success');
      setMedicineName('');
      setDescription('');
      setImageURL('');
      setModalOpen(false);
      refetch();
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">My Advertisements</h2>
          <button
            className="px-5 py-2 bg-[#82b440] hover:bg-green-700 text-white rounded shadow"
            onClick={() => setModalOpen(true)}
          >
            + Add Advertisement
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4">
              <img src={ad.image} alt="medicine ad" className="w-full h-50 object-cover rounded" />
              <h3 className="font-semibold text-lg mt-3 text-gray-800">{ad.medicineName}</h3>
              <p className="text-gray-600 mt-1 text-sm">{ad.description}</p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Status:</span> {ad.status}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Seller:</span> {ad.sellerEmail}
              </p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl relative">
              <h3 className="text-xl font-bold mb-4 text-gray-700">New Advertisement</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Medicine Name"
                  className="input input-bordered w-full"
                />

                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Write a description"
                  rows={4}
                ></textarea>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn bg-green-600 text-white hover:bg-green-700"
                    onClick={handleSubmit}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAdvertisement;
