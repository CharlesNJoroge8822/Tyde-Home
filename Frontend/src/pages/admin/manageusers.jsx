import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiUser, FiMail, FiLock, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, 
  FiSearch, FiShield, FiCalendar, FiArrowLeft, FiSave, FiKey, FiPhone, 
  FiMapPin, FiShoppingBag, FiDollarSign, FiPackage, FiTruck, FiClock
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
    phone: '',
    address: '',
    is_admin: false
  });
  const [showAdminToggle, setShowAdminToggle] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://tyde-home.onrender.com/');
      setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async (userId) => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`https://tyde-home.onrender.com/orders/user/${userId}`);
      setUserOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch user orders');
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle user click to show orders
  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user.id);
    setShowOrdersModal(true);
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
      const response = await axios.post('https://tyde-home.onrender.com/register', formData);
      toast.success('User created successfully');
      fetchUsers();
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        is_admin: false
      });
      setShowAdminToggle(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create user');
    }
  };

  // Update existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://tyde-home.onrender.com/${editingUser.id}`, formData);
      toast.success('User updated successfully');
      fetchUsers();
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        is_admin: false
      });
      setShowAdminToggle(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`https://tyde-home.onrender.com/users/${userId}`);
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
      phone: user.phone || '',
      address: user.address || '',
      is_admin: user.is_admin || false
    });
    setShowAdminToggle(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
{/* Orders Modal */}
{showOrdersModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border-2 border-blue-700 relative">
      {/* Antique decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-800 opacity-10 rounded-full transform translate-x-12 translate-y-12"></div>
      <div className="absolute top-12 left-12 w-20 h-20 border-4 border-blue-300 rounded-full opacity-20"></div>
      
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 text-blue-50 flex justify-between items-center border-b border-blue-500">
        <div className="flex items-center">
          <FiShoppingBag className="text-blue-200 mr-3 text-2xl" />
          <div>
            <h2 className="text-xl font-bold font-serif tracking-wide">
              Order History for {selectedUser.name}
            </h2>
            <p className="text-xs text-blue-200 font-medium">
              {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} total
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowOrdersModal(false)}
          className="p-2 rounded-full hover:bg-blue-700 transition-colors text-blue-200 hover:text-white"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 overflow-y-auto max-h-[70vh] bg-blue-50 bg-opacity-30">
        {ordersLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
              <FiShoppingBag className="mx-auto text-4xl text-blue-600 opacity-70" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2 font-serif">No Orders Found</h3>
            <p className="text-blue-600 max-w-md mx-auto">
              {selectedUser.name} hasn't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {userOrders.map((order) => (
              <div 
                key={order.id} 
                className="border border-blue-200 rounded-lg p-5 bg-white bg-opacity-80 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Order ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold ${
                  order.status === 'completed' 
                    ? 'bg-green-700 text-green-50' 
                    : order.status === 'cancelled' 
                      ? 'bg-red-700 text-red-50' 
                      : 'bg-blue-700 text-blue-50'
                }`}>
                  {order.status?.toUpperCase() || 'PENDING'}
                </div>

                {/* Order header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-blue-100">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 flex items-center">
                      <FiPackage className="mr-2 text-blue-600" />
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-blue-600 mt-1 flex items-center">
                      <FiClock className="mr-2" />
                      {new Date(order.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Total Amount</p>
                    <p className="text-xl font-bold text-blue-800">
                      ${(order.total_amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center border-b border-blue-100 pb-2">
                    <FiDollarSign className="mr-2 text-blue-600" /> 
                    Order Items
                  </h4>
                  <ul className="space-y-3">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm bg-blue-50 p-3 rounded">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3 text-xs font-bold">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-blue-900">
                            {item.product_name || 'Unnamed Item'}
                          </span>
                        </div>
                        <span className="font-bold text-blue-800">
                          ${(item.price || 0).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery status */}
                <div className="flex justify-between items-center pt-4 border-t border-blue-100">
                  <div className="flex items-center text-sm text-blue-700">
                    <FiTruck className="mr-2 text-lg" />
                    <div>
                      <p className="font-semibold">Delivery Status</p>
                      <p className="capitalize">
                        {order.delivery_updates?.[0]?.status || 'Processing'}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm font-medium transition-colors border border-amber-200"
                    onClick={() => {/* Add view details handler */}}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="bg-blue-50 p-4 border-t border-blue-200 flex justify-between items-center">
        <p className="text-sm text-blue-700">
          Showing {userOrders.length} of {userOrders.length} orders
        </p>
        <button 
          onClick={() => setShowOrdersModal(false)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Search Bar */}
      <div className="mb-8 relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name, email or phone..."
          className="pl-12 w-full p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                {editingUser ? (
                  <>
                    <FiEdit2 className="mr-3" /> Edit User Profile
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-3" /> Register New User
                  </>
                )}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-5">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="0712345678"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Nairobi, Kenya"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {editingUser ? 'New Password (leave blank to keep)' : 'Password *'}
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
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required={!editingUser}
                        minLength={6}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  {showAdminToggle && (
                    <div className="flex items-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                      <input
                        type="checkbox"
                        name="is_admin"
                        id="is_admin"
                        checked={formData.is_admin}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_admin" className="ml-3 block text-sm font-medium text-gray-700 flex items-center">
                        <FiShield className="mr-2 text-indigo-600" /> Grant Admin Privileges
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  {editingUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setFormData({
                          name: '',
                          email: '',
                          password: '',
                          phone: '',
                          address: '',
                          is_admin: false
                        });
                      }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center border border-gray-200"
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center"
                  >
                    {editingUser ? (
                      <>
                        <FiSave className="mr-2" /> Update User
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" /> Create User
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <FiUser className="mr-3" /> User Directory ({filteredUsers.length})
              </h2>
            </div>
            <div className="p-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiUser className="mx-auto text-5xl opacity-30" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-500 mb-1">No users found</h3>
                  <p className="text-gray-400 mb-4">
                    {searchTerm ? 'Try a different search term' : 'Create your first user'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto bg-indigo-50 rounded-lg"
                    >
                      <FiArrowLeft className="mr-2" /> Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="p-5 hover:bg-gray-50 transition-colors group cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0 flex items-start">
                          <div className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-sm ${user.is_admin ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                            <FiUser className="text-xl" />
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap">
                              <h3 className="text-lg font-medium text-gray-800 mr-2">
                                {user.name}
                              </h3>
                              {user.is_admin && (
                                <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center">
                                  <FiShield className="mr-1.5" /> Admin
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 flex items-center mt-1">
                              <FiMail className="mr-2 text-sm opacity-70" /> {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-gray-600 flex items-center mt-1">
                                <FiPhone className="mr-2 text-sm opacity-70" /> {user.phone}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2 flex items-center">
                              <FiCalendar className="mr-1.5" /> 
                              Joined: {new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-100 hover:border-indigo-200 flex items-center shadow-sm hover:shadow-md"
                            title="Edit user"
                          >
                            <FiEdit2 className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-red-100 hover:border-red-200 flex items-center shadow-sm hover:shadow-md"
                            title="Delete user"
                          >
                            <FiTrash2 className="mr-2" /> Delete
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