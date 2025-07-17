import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const ManageCategory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data: categories = [], refetch } = useQuery({
        queryKey: ['manage-category'],
        queryFn: async () => {
            const res = await axiosSecure.get('/categories');
            return res.data;
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/categories/${id}`);
                    if (res.data.success) {
                        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                        refetch();
                    } else {
                        Swal.fire('Error!', 'Failed to delete the category.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    const onSubmit = async (data) => {
        const category = {
            name: data.categoryName,
            image: data.categoryImage,
            created_by: user.email,
            createdAt: new Date(),
        };
        try {
            const res = await axiosSecure.post('/categories', category);
            if (res.data.insertedId) {
                Swal.fire('Success', 'Category added successfully!', 'success');
                reset();
                refetch();
                setIsModalOpen(false);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to add category', 'error');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Categories ({categories.length})</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn bg-green-600 text-white">
                    + Add Category
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, idx) => (
                            <tr key={cat._id}>
                                <td>{idx + 1}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td>{cat.created_by}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="btn btn-sm btn-info"
                                    >
                                        Edit
                                    </button>
                                  
                                    <button onClick={() => handleDelete(cat._id)} className="btn btn-sm btn-error">
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="label">Category Name</label>
                                <input
                                    {...register('categoryName', { required: true })}
                                    className="input input-bordered w-full"
                                    placeholder="e.g., Tablet, Capsule"
                                />
                                {errors.categoryName && <p className="text-red-500 text-sm">Category name is required</p>}
                            </div>

                            <div>
                                <label className="label">Image URL</label>
                                <input
                                    {...register('categoryImage', { required: true })}
                                    className="input input-bordered w-full"
                                    placeholder="Paste image URL"
                                />
                                {errors.categoryImage && <p className="text-red-500 text-sm">Image URL is required</p>}
                            </div>

                            <button type="submit" className="btn bg-green-600 w-full text-white">
                                Add Category
                            </button>


                        </form>
                    </div>
                </div>
            )}

            {editingCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setEditingCategory(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">Update Category</h3>

                        <form
                            onSubmit={handleSubmit(async (data) => {
                                const updatedCategory = {
                                    name: data.categoryName,
                                    image: data.categoryImage,
                                    updatedAt: new Date(),
                                };

                                try {
                                    const res = await axiosSecure.patch(`/categories/${editingCategory._id}`, updatedCategory);
                                    if (res.data.success) {
                                        Swal.fire('Success', 'Category updated successfully!', 'success');
                                        refetch();
                                        setEditingCategory(null);
                                    } else {
                                        Swal.fire('Error', 'Failed to update category', 'error');
                                    }
                                } catch (error) {
                                    Swal.fire('Error', 'Something went wrong', 'error');
                                }
                            })}
                            className="space-y-4"
                        >
                            <div>
                                <label className="label">Category Name</label>
                                <input
                                    defaultValue={editingCategory.name}
                                    {...register('categoryName', { required: true })}
                                    className="input input-bordered w-full"
                                />
                                {errors.categoryName && <p className="text-red-500 text-sm">Category name is required</p>}
                            </div>

                            <div>
                                <label className="label">Image URL</label>
                                <input
                                    defaultValue={editingCategory.image}
                                    {...register('categoryImage', { required: true })}
                                    className="input input-bordered w-full"
                                />
                                {errors.categoryImage && <p className="text-red-500 text-sm">Image URL is required</p>}
                            </div>

                            <button type="submit" className="btn bg-blue-600 w-full text-white">
                                Update Category
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageCategory;
