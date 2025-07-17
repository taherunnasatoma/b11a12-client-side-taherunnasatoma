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
    const axiosSecure=useAxiosSecure()

    // Fetch categories
const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/categories');
      console.log('Categories from API:', res.data);
      return res.data;
    },
  });

    // Fetch medicines by user email
   const {
    data: medicines,
    isLoading,
    error
  } = useQuery({
    queryKey: ['medicines', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
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
            added_by: user?.email // Include for filtering
        };
        mutation.mutate(newMedicine);
        form.reset();
        setImageUrl('');
        setShowModal(false);
    };

    if (isLoading) return <p>Loading medicines...</p>;
    if (error) return <p className="text-red-500">Error loading medicines</p>;

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Manage Medicines</h2>
            <button className="btn bg-green-500 text-white mb-4" onClick={() => setShowModal(true)}>Add Medicine</button>

            {/* Medicine Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Generic</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Mass</th>
                            <th>Category</th>
                            <th>Company</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(medicines) && medicines.length > 0 ? (
                            medicines.map((med, i) => (
                                <tr key={i}>
                                    <td>{med.itemName}</td>
                                    <td>{med.genericName}</td>
                                    <td>${med.price}</td>
                                    <td>{med.discount}%</td>
                                    <td>{med.massUnit}</td>
                                    <td>{med.category}</td>
                                    <td>{med.company}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center text-gray-500">No medicines found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">Add New Medicine</h3>
                        <form onSubmit={handleAddMedicine} className="space-y-3">
                            <input type="text" name="itemName" placeholder="Item Name" required className="input input-bordered w-full" />
                            <input type="text" name="genericName" placeholder="Generic Name" required className="input input-bordered w-full" />
                            <textarea name="description" placeholder="Short Description" required className="textarea textarea-bordered w-full" />
                            <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full" required />
                            {uploading && <p className="text-blue-500">Uploading image...</p>}

                            <select name="category" className="select select-bordered w-full" required>
                                <option value="" disabled>Select Category</option>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((cat, i) => (
                                        <option key={i} value={cat.name}>{cat.name}</option>
                                    ))
                                ) : (
                                    <option disabled selected>No categories found</option>
                                )}

                            </select>

                            <input type="text" name="company" placeholder="Company Name" className="input input-bordered w-full" required />
                            <select name="massUnit" className="select select-bordered w-full" required>
                                <option value="mg">mg</option>
                                <option value="ml">ml</option>
                            </select>
                            <input type="number" name="price" placeholder="Price" className="input input-bordered w-full" required />
                            <input type="number" name="discount" placeholder="Discount (%)" className="input input-bordered w-full" defaultValue={0} />

                            <div className="flex justify-between mt-4">
                                <button type="submit" className="btn btn-success">Submit</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-error">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMedicines;
