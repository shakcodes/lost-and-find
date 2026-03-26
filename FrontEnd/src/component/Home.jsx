import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('https://lost-and-find.onrender.com/api/getLostItems');
        setLostItems(res.data.reverse().slice(0, 6)); // show latest 6
      } catch (err) {
        console.error("Failed to load lost items", err);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-6 sm:py-10 px-4 sm:px-6'>
      {/* Hero Section */}
      <div className='text-center mb-8 sm:mb-12'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2'>
          Welcome to Find and Lost
        </h1>
        <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4'>
          This site helps you find lost items like smartphones, gadgets, documents, and more. Whether you've lost something or found an item, we're here to help!
        </p>
      </div>

      {/* Action Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 px-2 sm:px-0'>
        <div className='bg-white p-5 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2'>Lost Something?</h2>
          <p className='text-sm sm:text-base text-gray-600'>Report your lost item and let our community help you find it.</p>
          <Link to='/Lost' className='mt-4 inline-block bg-blue-500 text-white px-5 sm:px-6 py-2 rounded hover:bg-blue-600 text-sm sm:text-base'>
            Report Lost
          </Link>
        </div>
        <div className='bg-white p-5 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2'>Found Something?</h2>
          <p className='text-sm sm:text-base text-gray-600'>Report a found item and help return it to the owner.</p>
          <Link to='/find' className='mt-4 inline-block bg-purple-500 text-white px-5 sm:px-6 py-2 rounded hover:bg-purple-600 text-sm sm:text-base'>
            Report Found
          </Link>
        </div>
        <div className='bg-white p-5 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 sm:col-span-2 lg:col-span-1'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2'>How It Works</h2>
          <p className='text-sm sm:text-base text-gray-600'>Learn how we connect lost items with their rightful owners.</p>
          <button className='mt-4 bg-green-500 text-white px-5 sm:px-6 py-2 rounded hover:bg-green-600 text-sm sm:text-base'>
            Learn More
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-10 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6 px-2">
          Recently Reported Items
        </h2>
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 md:px-10 pb-4 snap-x snap-mandatory overflow-x-scroll scrollbar-hide">
            {lostItems.map((item) => (
              <div
                key={item._id}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-[350px] bg-white p-4 rounded-lg shadow-md snap-start flex-shrink-0"
              >
                {item.images?.[0] && (
                  <img
                    src={`https://lost-and-find.onrender.com/uploads/${item.images[0]}`}
                    alt={item.productName}
                    className="h-36 sm:h-40 w-full object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-base sm:text-lg font-bold truncate">{item.productName}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description?.slice(0, 70)}...</p>
                <p className="text-xs text-gray-400 mt-2">Reported: {new Date(item.date).toLocaleDateString()}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                  item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
