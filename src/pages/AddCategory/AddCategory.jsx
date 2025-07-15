

import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'; 
import useAxiosSecure from '../../hooks/useAxiosSecure';


const AddCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const axiosSecure = useAxiosSecure()

  const onSubmit = async (data) => {
    const category = {
      name: data.categoryName,
      image: data.categoryImage
    };

     try {
    const res = await axiosSecure.post('/categories', category);

    if (res.data.insertedId) {
      Swal.fire('Success', 'Category added successfully!', 'success');
      reset();
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Something went wrong.', 'error');
  }


  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-base-100 rounded shadow">
      

      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Category</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Category Name</label>
          <input
            {...register('categoryName', { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., Tablet, Syrup"
          />
          {errors.categoryName && <p className="text-red-500">This field is required</p>}
        </div>

        <div>
          <label className="label">Image URL</label>
          <input
            {...register('categoryImage', { required: true })}
            className="input input-bordered w-full"
            placeholder="Paste image link here"
          />
          {errors.categoryImage && <p className="text-red-500">This field is required</p>}
        </div>

        <button type="submit" className="btn bg-[#82b440] text-white w-full">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
