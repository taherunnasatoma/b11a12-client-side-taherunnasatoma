import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
import { FaEye, FaCartPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useCart } from '../../../../contexts/CardContext/CardContext';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const CategoryDetails = () => {
  const { categoryName } = useParams();
  const axiosSecure = useAxiosSecure();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    toast.success(`${medicine.itemName} added to cart!`);
  };

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ['category-medicines', categoryName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines?category=${categoryName}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading medicines...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Medicines in "{categoryName}"</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Generic</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Mass</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, i) => (
              <tr key={i}>
                <td>{med.itemName}</td>
                <td>{med.genericName}</td>
                <td>${med.price}</td>
                <td>{med.discount}%</td>
                <td>{med.massUnit}</td>
                <td>{med.company}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => setSelectedMedicine(med)}><FaEye /></button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAddToCart(med)}
                  >
                    <FaCartPlus />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing medicine details */}
      {selectedMedicine && (
        <Modal
          isOpen={!!selectedMedicine}
          onRequestClose={() => setSelectedMedicine(null)}
          contentLabel="Medicine Details"
          className="bg-white max-w-lg mx-auto mt-24 p-6 rounded shadow"
          overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        >
          <button onClick={() => setSelectedMedicine(null)} className="absolute top-3 right-3 text-red-500">✕</button>
          <h2 className="text-2xl font-bold mb-3">{selectedMedicine.itemName}</h2>
          <img src={selectedMedicine.image} alt={selectedMedicine.itemName} className="w-full h-52 object-cover rounded mb-4" />
          <p><strong>Generic:</strong> {selectedMedicine.genericName}</p>
          <p><strong>Description:</strong> {selectedMedicine.description}</p>
          <p><strong>Company:</strong> {selectedMedicine.company}</p>
          <p><strong>Price:</strong> ${selectedMedicine.price}</p>
          <p><strong>Discount:</strong> {selectedMedicine.discount}%</p>
          <p><strong>Mass Unit:</strong> {selectedMedicine.massUnit}</p>
        </Modal>
      )}
    </div>
  );
};

export default CategoryDetails;
