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
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">🗂️Manage Categories ({categories.length})</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn bg-[#82b440] hover:bg-[#6ea431] text-white px-4 py-2 rounded">
                    + Add Category
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded shadow bg-white">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-sm">
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
                                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td>{cat.created_by}</td>
                                <td className="space-x-1">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="btn btn-xs sm:btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="btn btn-xs sm:btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Category Modal */}
            {isModalOpen && (
                <ModalWrapper onClose={() => setIsModalOpen(false)} title="Add New Category">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input label="Category Name" name="categoryName" register={register} errors={errors} />
                        <Input label="Image URL" name="categoryImage" register={register} errors={errors} />
                        <button type="submit" className="btn w-full bg-[#82b440] hover:bg-[#6ea431] text-white">
                            Add Category
                        </button>
                    </form>
                </ModalWrapper>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
                <ModalWrapper onClose={() => setEditingCategory(null)} title="Update Category">
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
                        <Input
                            label="Category Name"
                            name="categoryName"
                            register={register}
                            errors={errors}
                            defaultValue={editingCategory.name}
                        />
                        <Input
                            label="Image URL"
                            name="categoryImage"
                            register={register}
                            errors={errors}
                            defaultValue={editingCategory.image}
                        />
                        <button type="submit" className="btn w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Update Category
                        </button>
                    </form>
                </ModalWrapper>
            )}
        </div>
    );
};

// Reusable Input Field
const Input = ({ label, name, register, errors, defaultValue }) => (
    <div>
        <label className="label">{label}</label>
        <input
            {...register(name, { required: true })}
            defaultValue={defaultValue}
            className="input input-bordered w-full"
        />
        {errors[name] && <p className="text-red-500 text-sm mt-1">{label} is required</p>}
    </div>
);

// Modal Wrapper
const ModalWrapper = ({ onClose, title, children }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white max-w-md w-full rounded-lg p-6 relative shadow-lg">
            <button
                onClick={onClose}
                className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-lg"
            >
                ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            {children}
        </div>
    </div>
);

export default ManageCategory;
