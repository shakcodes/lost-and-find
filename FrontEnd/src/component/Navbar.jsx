import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiMessageSquare, FiPlusCircle } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-white text-2xl font-bold tracking-tight">Find&Lost</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/find" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Browse</Link>
              {token ? (
                <>
                  <Link to="/lost" className="flex items-center text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <FiPlusCircle className="mr-1" /> Report
                  </Link>
                  <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      <FiUser className="mr-1" /> Account 
                    </button>
                    {isMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FiLogOut className="mr-2" /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                  <Link to="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-200 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/find" className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Browse</Link>
            {token ? (
              <>
                <Link to="/lost" className="flex items-center text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  <FiPlusCircle className="mr-2" /> Report
                </Link>
                <Link to="/profile" className="flex items-center text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  <FiUser className="mr-2" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center w-full text-left text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  <FiLogOut className="mr-2" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                <Link to="/signup" className="bg-white text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
