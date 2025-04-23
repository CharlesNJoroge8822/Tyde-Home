import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { 
  FiTruck, FiPackage, FiSearch, FiEdit, FiTrash2, 
  FiPlus, FiX, FiCalendar, FiInfo, FiCheck, FiClock,
  FiUser, FiDollarSign, FiBox
} from 'react-icons/fi';

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    deliveries: false,
    orders: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    order_id: '',
    carrier: '',
    tracking_number: '',
    tracking_url: '',
    estimated_delivery: ''
  });

  // Fetch deliveries
  const fetchDeliveries = async () => {
    setLoading(prev => ({ ...prev, deliveries: true }));
    try {
      let url = 'http://127.0.0.1:5000/api/deliveries';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch deliveries');
      
      setDeliveries(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, deliveries: false }));
    }
  };
// date
  // Fetch recent orders
  const fetchRecentOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const token = localStorage.getItem('token'); // or however you store the token
      const response = await fetch('http://127.0.0.1:5000/orders/admin-orders?per_page=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
      
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };
  

  // Create or update delivery
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Auto-generate tracking URL if not provided
    const finalFormData = {
      ...formData,
      tracking_url:
        formData.tracking_url ||
        generateTrackingUrl(formData.carrier, formData.tracking_number),
      estimated_delivery:
        formData.estimated_delivery ||
        new Date().toISOString().split('T')[0],
    };

    const url = editingDelivery
      ? `http://127.0.0.1:5000/api/deliveries/${editingDelivery.id}`
      : 'http://127.0.0.1:5000/api/deliveries';

    const method = editingDelivery ? 'PUT' : 'POST';

    // 🧾 Log the payload for debugging
    console.log("🚀 Sending payload to backend:", {
      url,
      method,
      payload: finalFormData,
    });

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalFormData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("⚠️ Backend error response:", data); // Log backend error too
      throw new Error(data.error || 'Failed to process delivery');
    }

    toast.success(
      `Delivery ${editingDelivery ? 'updated' : 'created'} successfully`
    );
    closeModal();
    fetchDeliveries();                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  } catch (error) {
    console.error("❌ Submission error:", error); // Extra safety
    toast.error(error.message);
  }
};

  // Generate tracking URL based on carrier
  const generateTrackingUrl = (carrier, trackingNumber) => {
    const carriers = {
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };
    return carriers[carrier] || '';
  };

  // Update delivery status
  const updateDeliveryStatus = async (deliveryId, currentStatus, newStatus) => {
    if (newStatus === currentStatus) return;
    
    try {
      // Check if current status is permanent
      if (['delivered', 'cancelled'].includes(currentStatus)) {
        toast.error(`This delivery is already ${currentStatus} and cannot be changed`);
        return;
      }

      // Check if new status is permanent
      if (['delivered', 'cancelled'].includes(newStatus)) {
        const result = await Swal.fire({
          title: `Mark as ${newStatus}?`,
          text: `This action cannot be undone. The delivery will be permanently ${newStatus}.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Yes, mark as ${newStatus}`
        });

        if (!result.isConfirmed) return;
      }
  
      const requestBody = { 
        status: newStatus,
        admin_id: 1 // In real app, use actual user ID
      };
  
      if (newStatus === 'delivered') {
        const { value: notes } = await Swal.fire({
          title: 'Delivery Notes',
          input: 'textarea',
          inputLabel: 'Enter delivery notes:',
          inputPlaceholder: 'Delivered successfully',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Please enter some notes!';
            }
          }
        });
        
        if (notes) {
          requestBody.notes = notes;
          requestBody.actual_delivery = new Date().toISOString();
        } else {
          return; // User cancelled
        }
      } else {
        requestBody.notes = `Status changed from ${currentStatus} to ${newStatus}`;
      }
  
      const response = await fetch(`http://127.0.0.1:5000/api/deliveries/${deliveryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to update status: ${response.statusText}`);
      }
  
      toast.success(`Status updated to ${newStatus}`);
      fetchDeliveries();
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  // Delete delivery
  const deleteDelivery = async (deliveryId) => {
    const result = await Swal.fire({
      title: 'Delete Delivery?',
      text: "This will permanently remove the delivery record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/deliveries/${deliveryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete delivery');
      }

      toast.success('Delivery deleted successfully');
      fetchDeliveries();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-update tracking URL when carrier or tracking number changes
    if ((name === 'carrier' || name === 'tracking_number') && !formData.tracking_url) {
      const newUrl = generateTrackingUrl(
        name === 'carrier' ? value : formData.carrier,
        name === 'tracking_number' ? value : formData.tracking_number
      );
      if (newUrl) {
        setFormData(prev => ({ ...prev, tracking_url: newUrl }));
      }
    }
  };

  // Open modal with order pre-selected
  const openCreateModal = (order = null) => {
    if (order) {
      setSelectedOrder(order);
      setFormData(prev => ({
        ...prev,
        order_id: order.id
      }));
    }
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (delivery) => {
    setEditingDelivery(delivery);
    setFormData({
      order_id: delivery.order_id,
      carrier: delivery.carrier,
      tracking_number: delivery.tracking_number,
      tracking_url: delivery.tracking_url || '',
      estimated_delivery: delivery.estimated_delivery || ''
    });
    setShowCreateModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowCreateModal(false);
    setEditingDelivery(null);
    setSelectedOrder(null);
    setFormData({
      order_id: '',
      carrier: '',
      tracking_number: '',
      tracking_url: '',
      estimated_delivery: ''
    });
  };

  useEffect(() => {
    fetchDeliveries();
    fetchRecentOrders();
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'in transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return <FiClock className="mr-1" />;
      case 'shipped': return <FiPackage className="mr-1" />;
      case 'in transit': return <FiTruck className="mr-1" />;
      case 'delivered': return <FiCheck className="mr-1" />;
      case 'cancelled': return <FiX className="mr-1" />;
      default: return <FiInfo className="mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <FiTruck className="text-2xl text-blue-500 mr-2" />
        <h1 className="text-2xl font-bold">Delivery Management</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => openCreateModal()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiPlus className="mr-2" />
              Create Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Horizontal List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        {loading.orders ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className={`flex-shrink-0 w-48 p-3 rounded-lg border cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => openCreateModal(order)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">#{order.id}</span>
                    <span className="text-xs text-gray-500">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="text-sm truncate mb-1">{order.user?.name || 'Unknown Customer'}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">${order.total_amount?.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.deliveries ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 
                      'No deliveries match your search criteria' : 
                      'No deliveries found'}
                  </td>
                </tr>
              ) : (
                deliveries.map(delivery => (
                  <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{delivery.order_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">{delivery.tracking_number}</div>
                      {delivery.tracking_url && (
                        <a 
                          href={delivery.tracking_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Track Package
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{delivery.carrier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.delivery_status)}`}>
                          {getStatusIcon(delivery.delivery_status)}
                          {delivery.delivery_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(delivery.estimated_delivery)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openEditModal(delivery)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => deleteDelivery(delivery.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                        <select
                          value={delivery.delivery_status}
                          onChange={(e) => updateDeliveryStatus(
                            delivery.id, 
                            delivery.delivery_status, 
                            e.target.value
                          )}
                          className={`text-xs p-1 rounded border ${getStatusColor(delivery.delivery_status)} hover:shadow-md transition-all`}
                          title="Change status"
                          disabled={['delivered', 'cancelled'].includes(delivery.delivery_status)}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="in transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Delivery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border-2 border-blue-200">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-t-lg border-b border-blue-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-800">
                  {editingDelivery ? 'Edit Delivery' : 'Create New Delivery'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedOrder && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <FiBox className="text-blue-500 mr-2" />
                    <h3 className="font-medium text-blue-800">Order #{selectedOrder.id}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <FiUser className="text-gray-500 mr-2" />
                      <span>{selectedOrder.user?.name || 'Unknown Customer'}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <span>Ordered: {formatDate(selectedOrder.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="text-gray-500 mr-2" />
                      <span>Total: ${selectedOrder.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  name="order_id"
                  value={formData.order_id}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Carrier Field */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Carrier *</label>
                    <select
                      name="carrier"
                      value={formData.carrier}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Carrier</option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="USPS">USPS</option>
                      <option value="DHL">DHL</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {/* Tracking Number */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Tracking Number *</label>
                    <input
                      type="text"
                      name="tracking_number"
                      value={formData.tracking_number}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="1Z12345E0205271688"
                    />
                  </div>
                  
                  {/* Tracking URL */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Tracking URL</label>
                    <input
                      type="url"
                      name="tracking_url"
                      value={formData.tracking_url}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Will auto-generate based on carrier"
                    />
                  </div>
                  
                  {/* Estimated Delivery */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Estimated Delivery *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="estimated_delivery"
                        value={formData.estimated_delivery}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    disabled={!formData.order_id}
                  >
                    {editingDelivery ? (
                      <>
                        <FiEdit className="mr-2" />
                        Update Delivery
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        Create Delivery
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveriesPage;