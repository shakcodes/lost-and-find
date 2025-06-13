import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Lost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productName: '',
    brand: '',
    color: '',
    serialNumber: '',
    category: '',
    location: '',
    date: '',
    description: '',
    type: ''
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [token, setToken] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setMessage({ text: 'Please login to report items', type: 'error' });
      // navigate('/login');
    }
    setToken(storedToken);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setMessage({ text: 'Maximum 5 images allowed', type: 'error' });
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setMessage({ text: 'Only JPG, PNG, or GIF images are allowed', type: 'error' });
      }
      if (!isValidSize) {
        setMessage({ text: 'Image size must be less than 5MB', type: 'error' });
      }
      
      return isValidType && isValidSize;
    });
    
    setImages(validFiles);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'productName', 'brand', 'color', 'location', 'date', 'category', 'description', 'type'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setMessage({ text: `Please fill in all required fields: ${missingFields.join(', ')}`, type: 'error' });
      return false;
    }

    if (images.length === 0) {
      setMessage({ text: 'Please upload at least one image', type: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      // Append images
      images.forEach((image, index) => {
        form.append('images', image);
      });

      const response = await axios.post('http://localhost:4000/api/lost', form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ text: 'Item reported successfully!', type: 'success' });
      setFormData({
        name: '',
        email: '',
        productName: '',
        brand: '',
        color: '',
        serialNumber: '',
        category: '',
        location: '',
        date: '',
        description: '',
        type: ''
      });
      setImages([]);
      
      // Redirect after success
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to submit report. Please try again.';
      
      setMessage({ text: errorMessage, type: 'error' });

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Report Lost or Found Item</h1>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'productName', label: 'Item Name', type: 'text' },
            { name: 'brand', label: 'Brand', type: 'text' },
            { name: 'color', label: 'Color', type: 'text' },
            { name: 'serialNumber', label: 'Serial Number', type: 'text', required: false },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'date', label: 'Date', type: 'date' },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
                {field.required !== false && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required !== false}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select type</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="wallet">Wallet</option>
              <option value="phone">Phone</option>
              <option value="key">Key</option>
              <option value="handbag">Handbag</option>
              <option value="laptop">Laptop</option>
              <option value="jewelry">Jewelry</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Image(s) <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">(Max 5 images, 5MB each)</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected files:</p>
              <ul className="text-sm text-gray-500">
                {images.map((image, index) => (
                  <li key={index}>{image.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors duration-200 flex items-center justify-center`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}

export default Lost;