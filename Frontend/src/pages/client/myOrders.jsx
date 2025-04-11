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
  FiLoader
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

  const fetchOrders = async (pageNum = 1, initialLoad = true) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      if (initialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
  
      const response = await fetch(
        `http://localhost:5000/orders/my-orders?page=${pageNum}&per_page=${pagination.perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );
  
      if (!response.ok) {
        // Try to get more error details
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  

      const data = await response.json();

      if (initialLoad) {
        setOrders(data.orders);
      } else {
        setOrders(prev => [...prev, ...data.orders]);
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
      if (initialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
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
    switch (status.toLowerCase()) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiPackage className="text-blue-500" />;
      case 'shipped': return <FiTruck className="text-purple-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <FiShoppingBag className="text-2xl text-indigo-600 mr-2" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
        {orders.length > 0 && (
          <span className="ml-auto bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            Showing {orders.length} of {pagination.total} orders
          </span>
        )}
      </div>
      
      {loading && orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiXCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't placed any orders. Start shopping!</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div 
                    className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 cursor-pointer"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="ml-2">
                        {expandedOrder === order.id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </span>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="pl-10 md:pl-14">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Estimated Delivery</h4>
                          <p className="text-gray-900">
                            {order.estimated_delivery ? formatDate(order.estimated_delivery) : 'Not available'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Delivery Updates</h4>
                          <div className="space-y-1">
                            {order.delivery_updates?.length > 0 ? (
                              order.delivery_updates.map((update, idx) => (
                                <div key={idx} className="text-sm">
                                  <p className="text-gray-900 font-medium">{update.status}</p>
                                  <p className="text-gray-500">{formatDate(update.updated_at)}</p>
                                  {update.notes && <p className="text-gray-700">{update.notes}</p>}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No updates yet</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                        <div className="space-y-4">
                          {order.order_items?.length > 0 ? (
                            order.order_items.map((item) => (
                              <div key={item.id} className="flex gap-4 items-start">
                                {item.image && (
                                  <div className="flex-shrink-0">
                                    <img 
                                      src={item.image} 
                                      alt={item.product_name}
                                      className="h-16 w-16 rounded-md object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-gray-900 font-medium">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    SKU: {item.sku}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-900 font-medium">
                                    {formatCurrency(item.price_at_purchase * item.quantity)}
                                  </p>
                                  <p className="text-sm text-gray-500">
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
            </div>
          </div>

          {pagination.hasMore && (
            <div className="flex justify-center">
              <button
                onClick={loadMoreOrders}
                disabled={loadingMore}
                className="flex items-center justify-center bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
              >
                {loadingMore ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : 'Load More Orders'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;