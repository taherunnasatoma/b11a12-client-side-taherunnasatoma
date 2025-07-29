import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ManageMedicines = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosSecure.get('/categories');
            return res.data;
        }
    });

    // Fetch medicines by user email
    const {
        data: medicines = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['medicines', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/medicines?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Mutation to add medicine
    const mutation = useMutation({
        mutationFn: async (newMed) => {
            const res = await axiosSecure.post('/medicines', newMed);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire('Success!', 'Medicine added successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
        }
    });

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        setUploading(true);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`, formData);
        setImageUrl(res.data.data.url);
        setUploading(false);
    };

    const handleAddMedicine = (e) => {
        e.preventDefault();
        const form = e.target;
        const newMedicine = {
            itemName: form.itemName.value,
            genericName: form.genericName.value,
            description: form.description.value,
            image: imageUrl,
            category: form.category.value,
            company: form.company.value,
            massUnit: form.massUnit.value,
            price: parseFloat(form.price.value),
            discount: parseFloat(form.discount.value || 0),
            added_by: user?.email
        };
        mutation.mutate(newMedicine);
        form.reset();
        setImageUrl('');
        setShowModal(false);
    };

    if (isLoading) return <p className="text-gray-600">Loading medicines...</p>;
    if (error) return <p className="text-red-500">Error loading medicines</p>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Manage Medicines</h2>
                    <button
                        className="px-4 py-2 bg-[#82b440] hover:bg-green-700 text-white rounded shadow"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Medicine
                    </button>
                </div>

                {/* Medicine Table */}
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Image</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Generic</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Discount</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Mass</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Company</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {medicines.length > 0 ? (
                                medicines.map((med, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">
                                            <img
                                                src={med.image}
                                                alt={med.itemName}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3">{med.itemName}</td>
                                        <td className="px-4 py-3">{med.genericName}</td>
                                        <td className="px-4 py-3">${med.price}</td>
                                        <td className="px-4 py-3">{med.discount}%</td>
                                        <td className="px-4 py-3">{med.massUnit}</td>
                                        <td className="px-4 py-3">{med.category}</td>
                                        <td className="px-4 py-3">{med.company}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center px-4 py-6 text-gray-500">No medicines found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl">
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Medicine</h3>
                            <form onSubmit={handleAddMedicine} className="space-y-4">
                                <input type="text" name="itemName" placeholder="Item Name" required className="input input-bordered w-full" />
                                <input type="text" name="genericName" placeholder="Generic Name" required className="input input-bordered w-full" />
                                <textarea name="description" placeholder="Short Description" required className="textarea textarea-bordered w-full" />
                                <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full" required />
                                {uploading && <p className="text-blue-500 text-sm">Uploading image...</p>}

                                <select name="category" className="select select-bordered w-full" required>
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((cat, i) => (
                                        <option key={i} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>

                                <input type="text" name="company" placeholder="Company Name" className="input input-bordered w-full" required />
                                <select name="massUnit" className="select select-bordered w-full" required>
                                    <option value="mg">mg</option>
                                    <option value="ml">ml</option>
                                </select>
                                <input type="number" name="price" placeholder="Price" className="input input-bordered w-full" required />
                                <input type="number" name="discount" placeholder="Discount (%)" className="input input-bordered w-full" defaultValue={0} />

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-error">Cancel</button>
                                    <button type="submit" className="btn btn-success">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMedicines;
