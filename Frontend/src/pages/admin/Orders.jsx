import React, { useState, useEffect } from 'react';
import {
  FiPackage, FiTruck, FiCheckCircle, FiClock, 
  FiXCircle, FiChevronDown, FiChevronUp,FiChevronLeft, FiChevronRight,
  FiInfo, FiPhone, FiMapPin, FiCalendar, FiUser, FiMail, FiRefreshCw
} from 'react-icons/fi';
import { FaBoxOpen, FaShippingFast, FaSearch } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryData, setDeliveryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingDeliveries, setLoadingDeliveries] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage,
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(searchQuery && { search: searchQuery })
        });

        // Fetch orders
        const ordersResponse = await fetch(
          `http://127.0.0.1:5000/orders/admin-orders?${params.toString()}`
        );
        
        if (!ordersResponse.ok) {
          const errorData = await ordersResponse.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders);
        setTotalPages(ordersData.pagination.pages);
        
        // Initialize delivery data loading states
        const initialDeliveryLoading = {};
        ordersData.orders.forEach(order => {
          initialDeliveryLoading[order.id] = true;
        });
        setLoadingDeliveries(initialDeliveryLoading);
        
        // Fetch delivery status for each order
        ordersData.orders.forEach(async (order) => {
          try {
            const deliveryResponse = await fetch(
              `http://127.0.0.1:5000/api/deliveries/order/${order.id}/status`
            );
            
            if (!deliveryResponse.ok) {
              throw new Error(`Failed to fetch delivery status for order ${order.id}`);
            }
            
            const deliveryStatus = await deliveryResponse.json();
            
            setDeliveryData(prev => ({
              ...prev,
              [order.id]: deliveryStatus
            }));
          } catch (err) {
            console.error(err);
            setDeliveryData(prev => ({
              ...prev,
              [order.id]: {
                error: err.message,
                order_status: order.status
              }
            }));
          } finally {
            setLoadingDeliveries(prev => ({
              ...prev,
              [order.id]: false
            }));
          }
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to search
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, statusFilter, searchQuery]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const refreshData = () => {
    setCurrentPage(1);
    setSearchQuery('');
    setStatusFilter('all');
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <FiClock className="text-yellow-500" />,
      'processing': <FiPackage className="text-blue-500" />,
      'shipped': <FiTruck className="text-indigo-500" />,
      'in transit': <FaShippingFast className="text-purple-500" />,
      'delivered': <FiCheckCircle className="text-green-500" />,
      'cancelled': <FiXCircle className="text-red-500" />
    };
    return icons[status.toLowerCase()] || <FaBoxOpen className="text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'in transit': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDeliveryProgress = (status) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'in transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status.toLowerCase());
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-12 grid gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                  <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Refresh page
                  </button>
                  <button
                    onClick={refreshData}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <FiRefreshCw className="mr-1" /> Reset filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Order Management Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage all customer orders
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                {['pending', 'processing', 'shipped', 'in transit', 'delivered', 'cancelled'].map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="mr-2" /> Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {statusFilter === 'all' && !searchQuery
                  ? "There are currently no orders in the system."
                  : `No orders match your ${statusFilter !== 'all' ? 'status filter' : 'search criteria'}.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={refreshData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                deliveryInfo={deliveryData[order.id] || {}}
                isLoadingDelivery={loadingDeliveries[order.id]}
                isExpanded={expandedOrder === order.id}
                onToggleExpand={toggleOrderExpand}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                getDeliveryProgress={getDeliveryProgress}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * 10, totalPages * 10)}</span> of{' '}
                  <span className="font-medium">{totalPages * 10}</span> orders
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Card Component for better organization
const OrderCard = ({
  order,
  deliveryInfo,
  isLoadingDelivery,
  isExpanded,
  onToggleExpand,
  getStatusIcon,
  getStatusColor,
  formatDate,
  getDeliveryProgress
}) => {
  const hasDeliveryError = deliveryInfo.error;

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
      {/* Order Summary */}
      <div 
        className="px-6 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggleExpand(order.id)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center">
            <div className="mr-4 mt-1 sm:mt-0">
              {getStatusIcon(order.status)}
            </div>
            <div>
              <div className="flex items-baseline">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{order.id}
                </h3>
                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Placed on {formatDate(order.created_at)}
              </p>

              {/* Customer Info */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center text-gray-500">
                  <FiUser className="mr-1.5" />
                  <span>{order.user?.name || 'Unknown Customer'}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FiMail className="mr-1.5" />
                  <span>{order.user?.email || 'No email'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center sm:space-x-4">
            <span className="text-lg font-semibold text-gray-900">
              ${order.total_amount.toFixed(2)}
            </span>
            {isExpanded ? (
              <FiChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <FiChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      {/* first_name */}
      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="px-6 py-5 sm:px-6 bg-gray-50">
          {/* Order Items */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Items Ordered</h4>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.order_items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.product_name} />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-sm text-gray-500">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price_at_purchase.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Delivery Information</h4>
            
            {isLoadingDelivery ? (
              <div className="animate-pulse bg-gray-100 rounded-lg p-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : hasDeliveryError ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiXCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Error loading delivery information: {deliveryInfo.error}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Delivery Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Delivery Progress
                    </span>
                    <span className="text-sm text-gray-500">
                      {deliveryInfo.order_status ? 
                        deliveryInfo.order_status.charAt(0).toUpperCase() + deliveryInfo.order_status.slice(1) : 
                        'Unknown'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        deliveryInfo.order_status === 'delivered' ? 'bg-green-500' :
                        deliveryInfo.order_status === 'cancelled' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} 
                      style={{ width: `${getDeliveryProgress(deliveryInfo.order_status)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Delivery Details Card */}
                {deliveryInfo.delivery ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <FiTruck className="text-gray-500 mr-2" />
                          <h5 className="text-sm font-medium text-gray-500">Carrier</h5>
                        </div>
                        <p className="text-lg font-medium">
                          {deliveryInfo.delivery.carrier || 'Not specified'}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <FiPhone className="text-gray-500 mr-2" />
                          <h5 className="text-sm font-medium text-gray-500">Tracking</h5>
                        </div>
                        {deliveryInfo.delivery.tracking_number ? (
                          <a
                            href={deliveryInfo.delivery.tracking_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-blue-600 hover:underline"
                          >
                            {deliveryInfo.delivery.tracking_number}
                          </a>
                        ) : (
                          <p className="text-lg font-medium text-gray-500">Not available</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <FiCalendar className="text-gray-500 mr-2" />
                          <h5 className="text-sm font-medium text-gray-500">Estimated Delivery</h5>
                        </div>
                        <p className="text-lg font-medium">
                          {formatDate(deliveryInfo.delivery.estimated_delivery)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Delivery information not yet available. Your order is being processed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div>
                  <h5 className="text-md font-medium text-gray-900 mb-4">Status Updates</h5>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {deliveryInfo.status_updates?.length > 0 ? (
                        deliveryInfo.status_updates.map((update, updateIdx) => (
                          <li key={updateIdx}>
                            <div className="relative pb-8">
                              {updateIdx !== deliveryInfo.status_updates.length - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-50 ${
                                    getStatusColor(update.status).replace('text', 'bg')
                                  }`}>
                                    {getStatusIcon(update.status)}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Status changed to <span className="font-medium text-gray-900">
                                        {update.status}
                                      </span>
                                      {update.notes && (
                                        <span className="block mt-1 text-sm text-gray-500">
                                          Note: {update.notes}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time dateTime={update.updated_at}>
                                      {formatDate(update.updated_at)}
                                    </time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                          No status updates available yet
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;