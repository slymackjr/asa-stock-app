import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars, FaTimes, FaTachometerAlt, FaBoxOpen, FaPlusCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { logo } from '../assets/images';
import axios from 'axios';

const NavBar = ({
  children,
  activeLink,
}) => {
  const navigate = useNavigate();
  const defaultLink = "text-gray-900 hover:bg-gray-100";
  const activeLinkStyle = "text-blue-500 bg-blue-100";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navRef = useRef(null);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsNavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('ability');
      localStorage.removeItem('user');
  
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="bg-gray-80 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white shadow">
        <div className="px-3 py-1 lg:px-5 lg:pl-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="App Logo" className="w-40" /> {/* Replace logo with your app logo */}
          </Link>
          <div className="flex items-center space-x-10">
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="relative" ref={profileRef}>
              <FaUserCircle
                size={24}
                className="text-gray-700 cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                  {/* <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link> */}
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Gray Overlay for Mobile Nav (only show in mobile view when nav is open) */}
      {isNavOpen && (
        <div className="fixed inset-0 bg-gray-900 opacity-50 z-30 lg:hidden" onClick={() => setIsNavOpen(false)}></div>
      )}
      {/* Page Layout */}
      <div className="flex flex-1 pt-16 mt-2 h-full">
        <aside
          className={`lg:w-64 bg-white shadow-lg lg:block ${isNavOpen ? 'h-screen' : 'hidden'} fixed lg:relative z-40 lg:h-screen h-full`}
          ref={navRef}
        >
          <ul className="p-4 space-y-4">
            <li>
              <Link to="/dashboard"
                className={`flex items-center ${activeLink === 'dashboard' ? activeLinkStyle : defaultLink} p-2 rounded-lg`}>
                <FaTachometerAlt className="mr-2" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/products"
                className={`flex items-center ${activeLink === 'products' ? activeLinkStyle : defaultLink} p-2 rounded-lg`}>
                <FaBoxOpen className="mr-2" /> Products
              </Link>
            </li>
            <li>
              <Link to="/add-product"
                className={`flex items-center ${activeLink === 'add-product' ? activeLinkStyle : defaultLink} p-2 rounded-lg`}>
                <FaPlusCircle className="mr-2" /> Add Product
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-4 lg:ml-50">
          {children}
        </main>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  children: PropTypes.node,
  activeLink: PropTypes.string,
};

export default NavBar;
