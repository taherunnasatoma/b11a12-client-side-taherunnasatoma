import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaEye, FaCartPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { useCart } from '../../contexts/CardContext/CardContext';
import toast from 'react-hot-toast'; // ✅ import toast

Modal.setAppElement('#root');

const Shop = () => {
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();

    const { data: medicines = [], isLoading } = useQuery({
        queryKey: ['medicines'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:3000/medicines');
            return res.data;
        },
    });

    const handleView = (medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    const handleAddToCart = (medicine) => {
        addToCart(medicine);
        toast.success(`${medicine.itemName} added to cart!`); // ✅ show toast
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Shop All Medicines</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Generic</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Mass</th>
                            <th className="px-4 py-2">Company</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med) => (
                            <tr key={med._id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{med.itemName}</td>
                                <td className="px-4 py-2">{med.genericName}</td>
                                <td className="px-4 py-2">{med.category}</td>
                                <td className="px-4 py-2">${med.price}</td>
                                <td className="px-4 py-2">{med.mass} {med.massUnit}</td>
                                <td className="px-4 py-2">{med.company}</td>
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <button onClick={() => handleView(med)} className="text-blue-500 hover:text-blue-700">
                                        <FaEye />
                                    </button>
                                    <button onClick={() => handleAddToCart(med)} className="btn btn-sm btn-success">
                                        <FaCartPlus />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white max-w-md mx-auto mt-24 p-6 rounded shadow-md"
                overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
            >
                {selectedMedicine && (
                    <div>
                        <img src={selectedMedicine.image} alt="Medicine" className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-xl font-semibold mb-2">{selectedMedicine.itemName}</h2>
                        <p><strong>Generic Name:</strong> {selectedMedicine.genericName}</p>
                        <p><strong>Company:</strong> {selectedMedicine.company}</p>
                        <p><strong>Description:</strong> {selectedMedicine.description}</p>
                        <p><strong>Mass:</strong> {selectedMedicine.mass} {selectedMedicine.massUnit}</p>
                        <p><strong>Price:</strong> ${selectedMedicine.price}</p>
                        <p><strong>Discount:</strong> {selectedMedicine.discount || 0}%</p>
                        <div className="mt-4 text-right">
                            <button onClick={() => setIsModalOpen(false)} className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Shop;
