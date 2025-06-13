import React from 'react';

function Footer() {
  return (
    <footer className='bg-gray-800 text-white py-12'>
      <div className='container mx-auto px-4'>
        {/* Footer Grid */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* About Section */}
          <div>
            <h3 className='text-xl font-bold mb-4'>About Us</h3>
            <p className='text-gray-400'>
              Find and Lost is a platform dedicated to helping people reunite with their lost items. Whether you've lost something or found an item, we're here to help.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
            <ul className='text-gray-400'>
              <li className='mb-2'>
                <a href='/' className='hover:text-white transition-colors duration-300'>
                  Home
                </a>
              </li>
              <li className='mb-2'>
                <a href='/find' className='hover:text-white transition-colors duration-300'>
                  Find
                </a>
              </li>
              <li className='mb-2'>
                <a href='/lost' className='hover:text-white transition-colors duration-300'>
                  Lost
                </a>
              </li>
              <li className='mb-2'>
                <a href='/login' className='hover:text-white transition-colors duration-300'>
                  Login/Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className='text-xl font-bold mb-4'>Contact Us</h3>
            <ul className='text-gray-400'>
              <li className='mb-2'>
                <span>Email: </span>
                <a href='mailto:support@findandlost.com' className='hover:text-white transition-colors duration-300'>
                  support@findandlost.com
                </a>
              </li>
              <li className='mb-2'>
                <span>Phone: </span>
                <a href='tel:+1234567890' className='hover:text-white transition-colors duration-300'>
                  +1 (234) 567-890
                </a>
              </li>
              <li className='mb-2'>
                <span>Address: </span>
                <p>123 Find & Lost St, City, Country</p>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className='text-xl font-bold mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors duration-300'>
                <i className='fab fa-facebook text-2xl'></i>
              </a>
              <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors duration-300'>
                <i className='fab fa-twitter text-2xl'></i>
              </a>
              <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors duration-300'>
                <i className='fab fa-instagram text-2xl'></i>
              </a>
              <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors duration-300'>
                <i className='fab fa-linkedin text-2xl'></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className='border-t border-gray-700 pt-8 text-center'>
          <p className='text-gray-400'>
            &copy; {new Date().getFullYear()} Find and Lost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;