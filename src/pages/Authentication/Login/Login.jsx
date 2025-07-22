import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';


const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const {signIn} = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from || '/'

  const onSubmit = data => {
    signIn(data.email,data.password)
    .then(result=>{
      console.log(result)
      navigate(from)
    })
    .catch(error=>{
      console.log(error)
    })
  }
  return (
    <div>
      
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h1 className="text-4xl font-bold"> Please Login Now!</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">

              <label className="label">Email</label>
              <input type="email" {...register('email')} className="input" placeholder="Email" />

              <label className="label">Password</label>
              <input type="password" {...register('password', {
                required: true,
                minLength: 6
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


              <div><a className="link link-hover">Forgot password?</a></div>
              <button className="btn bg-[#82b440] mt-4">Login</button>
            </fieldset>
            <p>Don't Have an Account ! Please <Link state={{from}} className='text-blue-600  btn-link' to='/register'>Register</Link></p>
          </form>
          <SocialLogin></SocialLogin>

        </div>
      </div>
    </div>
  );
};

export default Login;