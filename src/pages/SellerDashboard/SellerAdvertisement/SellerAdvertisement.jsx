import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import Swal from 'sweetalert2';

const SellerAdvertisement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: ads = [], refetch } = useQuery({
    queryKey: ['advertisements', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/advertisements?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setImageURL(data.data.url);
  };

  const handleSubmit = async () => {
    if (!imageURL || !description) {
      Swal.fire('All fields are required', '', 'error');
      return;
    }

    const newAd = {
      sellerEmail: user.email,
      image: imageURL,
      description
    };

    const res = await axiosSecure.post('/advertisements', newAd);
    if (res.data.insertedId) {
      Swal.fire('Advertisement submitted!', 'It will be reviewed shortly.', 'success');
      setImageURL('');
      setDescription('');
      setModalOpen(false);
      refetch();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">My Advertisements</h2>

      <button className="btn bg-green-600 text-white mb-4" onClick={() => setModalOpen(true)}>
        + Add Advertisement
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div key={ad._id} className="border p-4 rounded-lg shadow">
            <img src={ad.image} alt="medicine ad" className="w-full h-40 object-cover rounded" />
            <p className="mt-2">{ad.description}</p>
            <p className="mt-1 text-sm text-gray-600">Status: <span className="font-semibold">{ad.status}</span></p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-bold mb-4">New Advertisement</h3>
            <input type="file" onChange={handleImageUpload} className="mb-3" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Write a description"
              rows={4}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn bg-green-600 text-white" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerAdvertisement;
