

import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'; // or use react-hot-toast
import { Helmet } from 'react-helmet-async';

const AddCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const category = {
      name: data.categoryName,
      image: data.categoryImage
    };

    try {
      // TODO: replace URL with your backend endpoint
      const res = await fetch('https://your-api.com/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
      });

      const result = await res.json();
      if (result.insertedId) {
        Swal.fire('Success', 'Category added successfully!', 'success');
        reset();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-base-100 rounded shadow">
      <Helmet>
        <title>Add Category | Lifenix Admin</title>
      </Helmet>

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
