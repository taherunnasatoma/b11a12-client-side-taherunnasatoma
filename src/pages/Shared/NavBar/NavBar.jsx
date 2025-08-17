import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '/logo.png';
import { FaCartArrowDown } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import useAuth from '../../../hooks/useAuth';
import { useCart } from '../../../contexts/CardContext/CardContext';

const NavBar = () => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();


  const handleLogOut = () => {
    logOut()
      .then(() => console.log("Logged out"))
      .catch(error => console.log(error));
  };

  const navItems = (
    <>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/shop'>Shop</NavLink></li>
    
    </>
  );

  return (
    <div className="navbar bg-gray-50 shadow-md px-4 sticky top-0 z-50">
      
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navItems}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-auto h-25" />
        
        </Link>
      </div>

      {/* Center: NavItems */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navItems}
        </ul>
      </div>

      {/* Right: Cart, Language, Profile or Join */}
      <div className="navbar-end flex items-center gap-4">
        {/* Cart Icon */}
        <div className="relative">
  <Link to="/cart" className="tooltip tooltip-bottom" data-tip="Cart">
    <FaCartArrowDown className="text-2xl cursor-pointer" />
  </Link>
  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
      {cartItems.length}
    </span>
  )}
</div>


        {/* Language Dropdown Placeholder */}
        {/* <div className="dropdown dropdown-end hidden sm:block">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            Language <FaChevronDown className="ml-1" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] bg-base-100 shadow rounded-box w-40 p-2">
            <li><a>English</a></li>
            <li><a>বাংলা</a></li>
          </ul>
        </div> */}

        {/* User Avatar Dropdown OR Join Us */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt="Profile" />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              {/* <li><Link to="/updateProfile">Update Profile</Link></li> */}
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogOut}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
          <Link to="/login">
            <button className="btn bg-[#82b440] text-white">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn bg-[#82b440] text-white">Register</button>
          </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
