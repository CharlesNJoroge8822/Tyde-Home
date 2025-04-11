import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiUser, FiMail, FiLock, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, 
  FiSearch, FiShield, FiCalendar, FiArrowLeft, FiSave 
} from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/');
      setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/register', formData);
      toast.success('User created successfully');
      fetchUsers();
      setFormData({
        name: '',
        email: '',
        password: '',
        is_admin: false
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  // Update existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://127.0.0.1:5000/users/${editingUser.id}`, formData);
      toast.success('User updated successfully');
      fetchUsers();
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        is_admin: false
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  // Set form for editing
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password is empty for editing (won't change unless provided)
      is_admin: user.is_admin
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiUser className="mr-2" /> User Management
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                {editingUser ? (
                  <>
                    <FiEdit2 className="mr-2" /> Edit User
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Create New User
                  </>
                )}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingUser ? 'New Password (leave blank to keep)' : 'Password'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required={!editingUser}
                        minLength={6}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_admin"
                      id="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700 flex items-center">
                      <FiShield className="mr-1" /> Admin Privileges
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  {editingUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setFormData({
                          name: '',
                          email: '',
                          password: '',
                          is_admin: false
                        });
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    {editingUser ? (
                      <>
                        <FiSave className="mr-1" /> Update
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-1" /> Create
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <FiUser className="mr-2" /> User Directory
              </h2>
            </div>
            <div className="p-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <FiUser className="mx-auto text-4xl" />
                  </div>
                  <p className="text-gray-500">No users found</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
                    >
                      <FiArrowLeft className="mr-1" /> Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              <FiUser className="text-lg" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                                {user.name}
                                {user.is_admin && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full flex items-center">
                                    <FiShield className="mr-1" /> Admin
                                  </span>
                                )}
                              </h3>
                              <p className="text-gray-600 flex items-center">
                                <FiMail className="mr-1 text-sm" /> {user.email}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 flex items-center">
                            <FiCalendar className="mr-1" /> 
                            Joined: {new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm flex items-center"
                            title="Edit user"
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm flex items-center"
                            title="Delete user"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;