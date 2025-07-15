import React from 'react';
import { Outlet } from 'react-router';
import login from '../assets/login.json';
import Lottie from 'lottie-react';
import NavBar from '../pages/Shared/NavBar/NavBar';
import Footer from '../pages/Shared/Footer/Footer';

const AuthLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <div className="flex-grow hero bg-base-200">
                <div className="hero-content flex-col-reverse lg:flex-row-reverse w-full gap-5 ">
                    
                    
                    <div className=" flex justify-center items-center">
                        <Lottie
                            animationData={login}
                            loop={true}
                            className="w-40 sm:w-60 md:w-72 lg:max-w-sm"
                        />
                    </div>

                    
                    <div className="  flex justify-center items-center">
                        <div className="w-full max-w-md ">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AuthLayout;
