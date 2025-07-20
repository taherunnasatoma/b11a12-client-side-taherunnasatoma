import React from 'react';
import {  Link, NavLink, Outlet } from 'react-router';
import logo from '/logo.png'

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">
                {/* Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
                  
                </div>
                {/* Page content here */}
               <Outlet></Outlet>

                {/* Page content here */}

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}

                     <Link to='/'><a className="btn btn-ghost text-xl -ml-3 mb-4">
                    <img src={logo} alt="Litenix Logo" className="h-25 w-auto "/>

                </a></Link>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/dashboard/manageCategory'>Manage Category</NavLink></li>
                    <li><NavLink to='/dashboard/manageMedicines'>Manage Medicines</NavLink></li>
                    <li><NavLink to='/dashboard/myOrders'>My Orders</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;