import React from 'react';
import { Link } from 'react-router';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen  flex flex-col items-center justify-center  px-4">
            <div className="text-center">
                <FaBan className="text-6xl text-red-600 mb-4 animate-pulse" />
                <h1 className="text-4xl font-bold text-red-700 mb-2">403 - Forbidden</h1>
                <p className="text-lg text-gray-600 mb-6">
                    You don’t have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;
