import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiInfo,
  FiBox,
  FiCreditCard,
  FiAlertTriangle,
  FiMapPin
} from "react-icons/fi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    hasMore: true
  });
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchOrders = async (pageNum = 1, initialLoad = true) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      if (initialLoad) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `https://tyde-home.onrender.com/orders/my-orders?page=${pageNum}&per_page=${pagination.perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ordersWithUserSequence = data.orders.map((order, index) => ({
        ...order,
        userSequenceNumber: (pageNum - 1) * pagination.perPage + index + 1
      }));

      if (initialLoad) {
        setOrders(ordersWithUserSequence);
        // Calculate total spent by user
        const spent = data.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        setTotalSpent(spent);
      } else {
        setOrders(prev => [...prev, ...ordersWithUserSequence]);
      }

      setPagination({
        page: data.pagination.current_page,
        perPage: data.pagination.per_page,
        total: data.pagination.total,
        hasMore: data.pagination.has_next
      });

      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      if (initialLoad) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, true);
  }, []);

  const loadMoreOrders = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchOrders(pagination.page + 1, false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    const baseClass = "h-5 w-5";
    switch (status.toLowerCase()) {
      case 'pending': return <FiClock className={`${baseClass} text-amber-500`} />;
      case 'processing': return <FiPackage className={`${baseClass} text-blue-500`} />;
      case 'shipped': return <FiTruck className={`${baseClass} text-indigo-500`} />;
      case 'delivered': return <FiCheckCircle className={`${baseClass} text-emerald-500`} />;
      case 'cancelled': return <FiXCircle className={`${baseClass} text-rose-500`} />;
      default: return <FiPackage className={`${baseClass} text-gray-400`} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'; // Return default color if status is undefined or falsy
  
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'failed': return 'bg-rose-100 text-rose-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  

  const isDeliveryDelayed = (estimatedDelivery) => {
    if (!estimatedDelivery) return false;
    const deliveryDate = new Date(estimatedDelivery);
    const today = new Date();
    return today > deliveryDate;
  };

  const getDeliveryTimeIndicator = (estimatedDelivery) => {
    if (!estimatedDelivery) return null;
    
    const deliveryDate = new Date(estimatedDelivery);
    const today = new Date();
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        text: 'Delayed',
        color: 'bg-rose-100 text-rose-800',
        icon: <FiAlertTriangle className="h-4 w-4 text-rose-500" />
      };
    } else if (diffDays <= 2) {
      return {
        text: `Arriving in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
        color: 'bg-amber-100 text-amber-800',
        icon: <FiClock className="h-4 w-4 text-amber-500" />
      };
    } else if (diffDays <= 5) {
      return {
        text: `On the way (${diffDays} days)`,
        color: 'bg-blue-100 text-blue-800',
        icon: <FiTruck className="h-4 w-4 text-blue-500" />
      };
    } else {
      return {
        text: `Expected in ${diffDays} days`,
        color: 'bg-indigo-100 text-indigo-800',
        icon: <FiCalendar className="h-4 w-4 text-indigo-500" />
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-50">
            <FiShoppingBag className="text-2xl text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">Track and manage your purchases</p>
          </div>
        </div>
        
        {orders.length > 0 && (
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-gray-700">
                Showing <span className="text-indigo-600">{orders.length}</span> of{' '}
                <span className="text-indigo-600">{pagination.total}</span> orders
              </p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-gray-700">
                Total spent: <span className="text-emerald-600">{formatCurrency(totalSpent)}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && orders.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiXCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">Error loading orders</h3>
              <p className="text-sm text-rose-700">{error}</p>
              <button 
                onClick={() => fetchOrders(1, true)}
                className="mt-2 text-sm font-medium text-rose-700 hover:text-rose-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            You haven't placed any orders. When you do, they'll appear here.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/products'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </button>
          </div>
        </div>
      )}
{/* Payment Status */}

      {/* Orders List */}
      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              {/* Order Summary */}
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-1">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.userSequenceNumber}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <FiBox className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span>{order.order_items?.length || 0} items</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.payment_status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 px-5 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Order Number</span>
                          <span className="text-sm font-medium text-gray-900">#{order.userSequenceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Date Placed</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Amount</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Payment Method</span>
                          <span className="text-sm font-medium text-gray-900">{order.payment_method || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Payment Status</span>
                          <span className={`text-sm font-medium ${getPaymentStatusColor(order.payment_status)} px-2 py-0.5 rounded-full`}>
                            {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <span className="flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${
                              order.status === 'pending' ? 'bg-amber-500' :
                              order.status === 'processing' ? 'bg-blue-500' :
                              order.status === 'shipped' ? 'bg-indigo-500' :
                              order.status === 'delivered' ? 'bg-emerald-500' :
                              order.status === 'cancelled' ? 'bg-rose-500' :
                              'bg-gray-500'
                            }`}></span>
                            <span className="text-sm font-medium text-gray-900">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Estimated Delivery</span>
                          <span className="text-sm font-medium text-gray-900">
                            {order.estimated_delivery ? formatDate(order.estimated_delivery) : 'Calculating...'}
                          </span>
                        </div>
                        {order.estimated_delivery && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Delivery Status</span>
                            <span className={`text-xs font-medium ${
                              isDeliveryDelayed(order.estimated_delivery) 
                                ? 'bg-rose-100 text-rose-800' 
                                : 'bg-blue-100 text-blue-800'
                            } px-2 py-0.5 rounded-full flex items-center`}>
                              {isDeliveryDelayed(order.estimated_delivery) ? (
                                <>
                                  <FiAlertTriangle className="mr-1 h-3 w-3" />
                                  Delayed
                                </>
                              ) : (
                                <>
                                  <FiTruck className="mr-1 h-3 w-3" />
                                  On Time
                                </>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Shipping Address</span>
                          <span className="text-sm font-medium text-gray-900 text-right">
                            {order.shipping_address?.line1 || 'N/A'}<br />
                            {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                            {order.shipping_address?.postal_code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Updates */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Timeline</h4>
                      {order.estimated_delivery && getDeliveryTimeIndicator(order.estimated_delivery) && (
                        <div className={`mb-4 p-3 rounded-lg ${getDeliveryTimeIndicator(order.estimated_delivery).color} flex items-center`}>
                          {getDeliveryTimeIndicator(order.estimated_delivery).icon}
                          <span className="ml-2 text-sm font-medium">
                            {getDeliveryTimeIndicator(order.estimated_delivery).text}
                          </span>
                        </div>
                      )}
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {order.delivery_updates?.length > 0 ? (
                            order.delivery_updates.map((update, idx) => (
                              <li key={idx} className="relative pb-8">
                                {idx !== order.delivery_updates.length - 1 ? (
                                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                ) : null}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                      update.status === 'shipped' ? 'bg-indigo-500' :
                                      update.status === 'delivered' ? 'bg-emerald-500' :
                                      'bg-gray-400'
                                    }`}>
                                      {update.status === 'shipped' ? (
                                        <FiTruck className="h-4 w-4 text-white" />
                                      ) : update.status === 'delivered' ? (
                                        <FiCheckCircle className="h-4 w-4 text-white" />
                                      ) : (
                                        <FiInfo className="h-4 w-4 text-white" />
                                      )}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5">
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium text-gray-900 capitalize">
                                        {update.status.replace('_', ' ')}
                                      </p>
                                      <time className="text-sm text-gray-500">
                                        {formatDate(update.updated_at)}
                                      </time>
                                    </div>
                                    {update.notes && (
                                      <p className="text-sm text-gray-500 mt-1">{update.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No updates available</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Items</h4>
                    <div className="space-y-6">
                      {order.order_items?.length > 0 ? (
                        order.order_items.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <img 
                                src={item.image || '/placeholder-product.jpg'} 
                                alt={item.product_name}
                                className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/placeholder-product.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-base font-medium text-gray-900 truncate">
                                {item.product_name}
                              </h5>
                              <p className="text-sm text-gray-500 mt-1">
                                SKU: {item.sku || 'N/A'}
                              </p>
                              {item.variants && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {Object.entries(item.variants).map(([key, value]) => (
                                    <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-base font-medium text-gray-900">
                                {formatCurrency(item.price_at_purchase * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.quantity} × {formatCurrency(item.price_at_purchase)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No items found</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreOrders}
                disabled={loadingMore}
                className="relative inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed min-w-[200px]"
              >
                {loadingMore ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Loading...
                  </>
                ) : (
                  'Load More Orders'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;