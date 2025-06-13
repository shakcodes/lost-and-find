import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  let userId = null;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    }
  } catch (err) {
    console.error("Invalid token:", err.message);
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setMessage('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserItems = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/user/${userId}/items`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyItems(res.data);
      } catch (err) {
        console.error('Failed to load items:', err);
      }
    };

    if (userId && token) {
      fetchProfile();
      fetchUserItems();
    } else {
      setLoading(false);
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setProfile((prev) => ({ ...prev, avatar: res.data.url }));
      setMessage('Avatar uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('Avatar upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/profile/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
      console.error(err);
    }
  };
console.log(myItems);
  const handleDeleteClick = (itemId) => {
    setSelectedItemId(itemId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/lost/${selectedItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyItems(prev => prev.filter(item => item._id !== selectedItemId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete item');
    } finally {
      setModalOpen(false);
    }
  };

  if (!token || !userId) {
    return <p className="text-center mt-10 text-red-600">Please login to view your profile.</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">My Profile</h2>

      {profile.avatar && (
        <div className="flex justify-center mb-6">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        </div>
      )}

      {message && <p className="text-center text-green-600 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border border-gray-300 rounded p-3"
          required
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          readOnly
          className="w-full border bg-gray-100 rounded p-3"
        />
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border rounded p-3 min-h-[100px]"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full border rounded p-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 font-semibold rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">My Posted Items</h3>
        {myItems.length === 0 ? (
  <p className="text-center text-gray-600 italic">You haven’t posted any items yet.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {myItems.map((item) => (
      <div key={item._id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{item.productName}</h4>
        <p className="text-sm text-gray-600 mb-2">{item.description.slice(0, 80)}...</p>
        <p className="text-xs text-gray-500 mb-2">
          Posted on: {new Date(item.date).toLocaleDateString()}
        </p>
        {item.images?.length > 0 && (
          <img
            src={`http://localhost:4000/uploads/${item.images[0]}`}
            alt={item.productName}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )}
        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/edit-item/${item._id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(item._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}

      </div>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Profile;
