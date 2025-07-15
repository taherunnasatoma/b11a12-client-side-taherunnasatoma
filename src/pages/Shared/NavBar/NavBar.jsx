import React from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../../../assets/logo.png'

const NavBar = () => {

    const navItems = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/'>Shop</NavLink></li>
        <li><NavLink to='/addCategory'>Add Category</NavLink></li>



    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {
                            navItems
                        }
                    </ul>
                </div>
                <Link to='/'><a className="btn btn-ghost text-xl flex items-center gap-2">
                    <img src={logo} alt="Litenix Logo" className="h-16 w-auto" />

                </a></Link>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {
                        navItems
                    }
                </ul>
            </div>
            <div className="navbar-end">
              <Link to='/login'>  <a className="btn bg-[#82b440] text-white">Join Us</a></Link>
            </div>
        </div>
    );
};

export default NavBar;