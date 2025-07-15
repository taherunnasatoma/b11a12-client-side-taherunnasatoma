import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../pages/Shared/NavBar/NavBar';
import Footer from '../pages/Shared/Footer/Footer';

const RootLayout = () => {
    return (
         <div className="flex flex-col min-h-screen max-w-9xl mx-auto">
            <NavBar />
            
            <main className="flex-grow max-w-7xl mx-auto">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
};

export default RootLayout;