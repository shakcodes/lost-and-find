import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('https://lost-and-find.onrender.com/api/getLostItems');
        const selectedItem = data.find((itm) => itm._id === id);
        setItem(selectedItem || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching item:', err);
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!item) return <div className="text-center py-20 text-red-500">Item not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4">Details</h1>

      {item.images?.length > 0 && (
        <img
          src={`http://localhost:4000/uploads/${item.images[0]}`}
          alt={item.productName}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <div className="space-y-3 text-gray-700">
        <p><strong>Type:</strong> <span className="capitalize">{item.type}</span></p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Email:</strong> {item.email}</p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default ItemDetails;
