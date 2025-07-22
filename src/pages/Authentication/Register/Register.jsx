import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { createUser, updateUserProfile } = useAuth()
  const [profilePic, setProfilePic] = useState('')
  const axiosInstance = useAxios()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from || '/'

  const onSubmit = data => {
    console.log(data)
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user)


        const userInfo = {
          email: data.email,
          role: data.role || 'user',  // fallback to 'user' if missing
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
          name: data.name,
          photoURL: profilePic,

        }


        const userRes = await axiosInstance.post('/users', userInfo)
        console.log(userRes.data)


        const userProfile = {
          displayName: data.name,
          photoURL: profilePic
        }

        updateUserProfile(userProfile)
          .then(() => {
            console.log('profile name pic updated')
            navigate(from)
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleImageUpload = async (e) => {
    const image = e.target.files[0]
    console.log(image)

    const formData = new FormData();
    formData.append('image', image)
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`

    const res = await axios.post(imageUploadUrl, formData)

    setProfilePic(res.data.data.url)
  }
  return (


    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold">Create an Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">

            <label className="label">Your Name</label>
            <input type="text"
              {...register('name', {
                required: true
              })} className="input" placeholder="Your Name" />
            {
              errors.name?.type === 'required' && <>
                <p className='text-red-500'>Name is required</p>

              </>
            }


            <label className="label">Your Name</label>
            <input type="file"
              onChange={handleImageUpload}
              className="input" placeholder="Your Profile Picture" />

            {/* <-- Add Role Select here --> */}
            <label className="label">Select Role</label>
            <select {...register('role', { required: true })} className="input">
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
            {errors.role && <p className="text-red-500">Role is required</p>}


            <label className="label">Email</label>
            <input type="email" {...register('email', {
              required: true
            })} className="input" placeholder="Email" />
            {
              errors.email?.type === 'required' && <>
                <p className='text-red-500'>Email is required</p>

              </>
            }

            <label className="label">Password</label>
            <input type="password" {...register('password', {
              required: true, minLength: 6
            })} className="input" placeholder="Password" />
            {
              errors.password?.type === 'required' && <>
                <p className='text-red-500'>Password is required</p>

              </>
            }
            {
              errors.password?.type === 'minLength' && <>
                <p className='text-red-500'>Password must be 6 character longer</p>

              </>
            }

            <button className="btn bg-[#82b440] mt-4">Register</button>
          </fieldset>
          <p>Already Have an account? <Link className='text-blue-600 btn-link' to='/login'>Login</Link> </p>
        </form>

      </div>
    </div>

  );
};

export default Register;