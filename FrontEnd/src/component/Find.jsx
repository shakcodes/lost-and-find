import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

function Find() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/getLostItems');
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'lost' && item.type === 'lost') || 
      (filter === 'found' && item.type === 'found');
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (item) => {
    navigate(`/details/${item._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Lost & Found Items</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {item.images && item.images.length > 0 && (
                  <img
                    src={`http://localhost:4000/uploads/${item.images[0]}`}
                    alt={item.productName}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold truncate">{item.productName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm"><span className="font-medium">Location:</span> {item.location}</p>
                    <p className="text-sm"><span className="font-medium">Email Id:</span> {item.email}</p>
                    <p className="text-sm"><span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No items found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Find;
