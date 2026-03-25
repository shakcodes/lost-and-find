import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditItem = () => {
  const { id } = useParams(); // itemId from URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [itemData, setItemData] = useState({
    productName: '',
    brand: '',
    color: '',
    serialNumber: '',
    location: '',
    date: '',
    category: '',
    description: '',
    type: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`https://lost-and-find.onrender.com/api/lost/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItemData(res.data);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setMessage('Error loading item');
      }
    };
  
    fetchItem();
  }, [id]);
  
  

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://lost-and-find.onrender.com/api/lost/${id}`, itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Item updated successfully');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Failed to update item');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Edit Lost Item</h2>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productName"
          value={itemData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          name="brand"
          value={itemData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="color"
          value={itemData.color}
          onChange={handleChange}
          placeholder="Color"
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="serialNumber"
          value={itemData.serialNumber}
          onChange={handleChange}
          placeholder="Serial Number (optional)"
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="location"
          value={itemData.location}
          onChange={handleChange}
          placeholder="Last Seen Location"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={itemData.date?.slice(0, 10)}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={itemData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          name="description"
          value={itemData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded min-h-[100px]"
          required
        />
        <select
          name="type"
          value={itemData.type}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditItem;
