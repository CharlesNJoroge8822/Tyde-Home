import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage first
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone || '',
        address: storedUser.address || '',
      });
    }

    // Then verify with server and get latest data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('http://127.0.0.1:5000/login');
          return;
        }

        const response = await fetch('http://127.0.0.1:5000/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            address: userData.address || '',
          });
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: user.phone,
          address: user.address,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred while updating your profile');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-3xl mx-auto">
        {/* Antique-style header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 tracking-wider">My Profile</h1>
          <div className="w-24 h-1 bg-blue-700 mx-auto"></div>
        </div>

        {/* Profile card with antique paper look */}
        <div className="relative bg-blue-100 bg-opacity-70 rounded-lg shadow-lg p-8 border border-blue-300">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>

          {/* Message display */}
          {message && (
            <div className={`mb-6 p-3 rounded text-center font-medium ${
              message.includes('success') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Edit button */}
          {!isEditing && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-700 text-blue-50 rounded-md hover:bg-blue-800 transition duration-300 shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="mb-6">
                <label className="block text-blue-900 text-lg font-medium mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-4 py-2 bg-blue-50 border-b-2 border-blue-300 focus:outline-none focus:border-blue-600 text-blue-900"
                />
              </div>

              {/* Email field */}
              <div className="mb-6">
                <label className="block text-blue-900 text-lg font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-4 py-2 bg-blue-50 border-b-2 border-blue-300 focus:outline-none focus:border-blue-600 text-blue-900"
                />
              </div>

              {/* Phone field */}
              <div className="mb-6">
                <label className="block text-blue-900 text-lg font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-b-2 focus:outline-none focus:border-blue-600 text-blue-900 ${
                    isEditing ? 'bg-white border-blue-300' : 'bg-blue-50 border-blue-300'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address field */}
              <div className="mb-6 md:col-span-2">
                <label className="block text-blue-900 text-lg font-medium mb-2" htmlFor="address">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-blue-600 text-blue-900 ${
                    isEditing ? 'bg-white border-blue-300' : 'bg-blue-50 border-blue-300'
                  }`}
                  placeholder="Enter your delivery address"
                />
              </div>
            </div>

            {/* Action buttons when editing */}
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setMessage('');
                  }}
                  className="px-6 py-2 bg-blue-200 text-blue-900 rounded-md hover:bg-blue-300 transition duration-300 shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-blue-50 rounded-md hover:bg-blue-800 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Decorative footer */}
        <div className="text-center mt-12 text-blue-700">
          <p className="italic">"The journey of a thousand miles begins with a single step."</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;