// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Dashboard = () => {
//   // State for all data
//   const [ads, setAds] = useState([]);
//   const [deliveries, setDeliveries] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [orderItems, setOrderItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState('orders');
//   const [loading, setLoading] = useState(false);
//   const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

//   // Form states
//   const [adForm, setAdForm] = useState({
//     title: '',
//     product_id: '',
//     description: '',
//     image_url: '',
//     is_active: true,
//     position: 'sidebar'
//   });

//   const [deliveryForm, setDeliveryForm] = useState({
//     order_id: '',
//     carrier: '',
//     tracking_number: '',
//     tracking_url: '',
//     estimated_delivery: ''
//   });

//   const [orderStatusForm, setOrderStatusForm] = useState({
//     order_id: '',
//     status: 'pending'
//   });

//   const [orderForm, setOrderForm] = useState({
//     user_id: '',
//     status: 'pending',
//     items: [{ product_id: '', quantity: 1 }]
//   });

//   // Fetch all data with JWT auth
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const headers = {
//         'Authorization': `Bearer ${authToken}`,
//         'Content-Type': 'application/json'
//       };

//       const [adsRes, deliveriesRes, ordersRes, productsRes, usersRes] = await Promise.all([
//         fetch('http://127.0.0.1:5000/ads', { headers }),
//         fetch('http://127.0.0.1:5000/api/deliveries', { headers }),
//         fetch('http://127.0.0.1:5000/orders', { headers }),
//         fetch('http://127.0.0.1:5000/products', { headers }),
//         fetch('http://127.0.0.1:5000/users', { headers })
//       ]);

//       const adsData = await adsRes.json();
//       const deliveriesData = await deliveriesRes.json();
//       const ordersData = await ordersRes.json();
//       const productsData = await productsRes.json();
//       const usersData = await usersRes.json();

//       if (!adsRes.ok || !deliveriesRes.ok || !ordersRes.ok || !productsRes.ok || !usersRes.ok) {
//         throw new Error(adsData.error || deliveriesData.error || ordersData.error || productsData.error || usersData.error || 'Failed to fetch data');
//       }

//       setAds(Array.isArray(adsData) ? adsData : []);
//       setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
//       setOrders(Array.isArray(ordersData) ? ordersData : []);
//       setProducts(Array.isArray(productsData) ? productsData : []);
//       setUsers(Array.isArray(usersData) ? usersData : []);
//     } catch (error) {
//       toast.error(error.message || 'Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Order Operations
//   const handleCreateOrder = async (e) => {
//     e.preventDefault();
//     try {
//       // Validate items
//       const validItems = orderForm.items.filter(item => item.product_id && item.quantity > 0);
//       if (validItems.length === 0) {
//         throw new Error('At least one valid order item is required');
//       }

//       const response = await fetch('http://127.0.0.1:5000/orders', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           user_id: orderForm.user_id,
//           items: validItems
//         })
//       });
      
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create order');
//       }

//       setOrders([...orders, data.order]);
//       setOrderForm({
//         user_id: '',
//         status: 'pending',
//         items: [{ product_id: '', quantity: 1 }]
//       });
//       toast.success('Order created successfully');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const addOrderItem = () => {
//     setOrderForm({
//       ...orderForm,
//       items: [...orderForm.items, { product_id: '', quantity: 1 }]
//     });
//   };

//   const removeOrderItem = (index) => {
//     const newItems = [...orderForm.items];
//     newItems.splice(index, 1);
//     setOrderForm({
//       ...orderForm,
//       items: newItems
//     });
//   };

//   const handleOrderItemChange = (index, field, value) => {
//     const newItems = [...orderForm.items];
//     newItems[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
//     setOrderForm({
//       ...orderForm,
//       items: newItems
//     });
//   };

//   // AD Operations
//   const handleCreateAd = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://127.0.0.1:5000/ads', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify(adForm)
//       });
      
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create ad');
//       }

//       setAds([...ads, data.ad]);
//       setAdForm({
//         title: '',
//         product_id: '',
//         description: '',
//         image_url: '',
//         is_active: true,
//         position: 'sidebar'
//       });
//       toast.success('Ad created successfully');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleDeleteAd = async (adId) => {
//     if (window.confirm('Are you sure you want to delete this ad?')) {
//       try {
//         const response = await fetch(`http://127.0.0.1:5000/ads/${adId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${authToken}`
//           }
//         });
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to delete ad');
//         }
        
//         setAds(ads.filter(ad => ad.id !== adId));
//         toast.success('Ad deleted successfully');
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   // Delivery Operations
//   const handleCreateDelivery = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/deliveries', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           order_id: deliveryForm.order_id,
//           carrier: deliveryForm.carrier,
//           tracking_number: deliveryForm.tracking_number,
//           tracking_url: deliveryForm.tracking_url,
//           estimated_delivery: deliveryForm.estimated_delivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
//         })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create delivery');
//       }

//       setDeliveries([...deliveries, data.delivery]);
//       setDeliveryForm({
//         order_id: '',
//         carrier: '',
//         tracking_number: '',
//         tracking_url: '',
//         estimated_delivery: ''
//       });
//       toast.success('Delivery created successfully');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleUpdateDeliveryStatus = async (deliveryId, status) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/api/deliveries/${deliveryId}/status`, {
//         method: 'PATCH',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ status })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update delivery status');
//       }

//       setDeliveries(deliveries.map(d => d.id === deliveryId ? data.delivery : d));
//       toast.success('Delivery status updated');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Order Status Operations
//   const handleUpdateOrderStatus = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/orders/${orderStatusForm.order_id}/status`, {
//         method: 'PATCH',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ status: orderStatusForm.status })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update order status');
//       }

//       setOrders(orders.map(o => o.id === data.order.id ? data.order : o));
//       setOrderStatusForm({
//         order_id: '',
//         status: 'pending'
//       });
//       toast.success('Order status updated');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchOrderItems = async (orderId) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/orders/${orderId}`, {
//         headers: {
//           'Authorization': `Bearer ${authToken}`
//         }
//       });
      
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch order items');
//       }

//       setOrderItems(data.order_items || []);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleDeleteDelivery = async (deliveryId) => {
//     if (window.confirm('Are you sure you want to delete this delivery?')) {
//       try {
//         const response = await fetch(`http://127.0.0.1:5000/api/deliveries/${deliveryId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${authToken}`
//           }
//         });
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to delete delivery');
//         }
        
//         setDeliveries(deliveries.filter(d => d.id !== deliveryId));
//         toast.success('Delivery deleted successfully');
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
//       {/* Navigation Tabs */}
//       <div className="flex border-b border-gray-200 mb-8">
//         {['orders', 'deliveries', 'ads'].map((tab) => (
//           <button
//             key={tab}
//             className={`px-6 py-3 font-medium text-sm uppercase tracking-wider ${
//               activeTab === tab
//                 ? 'border-b-2 border-blue-500 text-blue-600'
//                 : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Orders Tab */}
//       {activeTab === 'orders' && (
//         <div className="space-y-8">
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
//             </div>
            
//             {/* Create Order Form */}
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">Create New Order</h3>
//               <form onSubmit={handleCreateOrder} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
//                   <select
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={orderForm.user_id}
//                     onChange={(e) => setOrderForm({...orderForm, user_id: e.target.value})}
//                     required
//                   >
//                     <option value="">Select User</option>
//                     {users.map(user => (
//                       <option key={user.id} value={user.id}>
//                         {user.name || `User #${user.id}`}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
//                   {orderForm.items.map((item, index) => (
//                     <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
//                         <select
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                           value={item.product_id}
//                           onChange={(e) => handleOrderItemChange(index, 'product_id', e.target.value)}
//                           required
//                         >
//                           <option value="">Select Product</option>
//                           {products.map(product => (
//                             <option key={product.id} value={product.id}>{product.name}</option>
//                           ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                         <input
//                           type="number"
//                           min="1"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                           value={item.quantity}
//                           onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div className="flex items-end">
//                         {orderForm.items.length > 1 && (
//                           <button
//                             type="button"
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             onClick={() => removeOrderItem(index)}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                     onClick={addOrderItem}
//                   >
//                     Add Item
//                   </button>
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Create Order
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Update Order Status Form */}
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">Update Order Status</h3>
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
//                   <select
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={orderStatusForm.order_id}
//                     onChange={(e) => setOrderStatusForm({...orderStatusForm, order_id: e.target.value})}
//                   >
//                     <option value="">Select Order</option>
//                     {orders.map(order => (
//                       <option key={order.id} value={order.id}>Order #{order.id}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
//                   <select
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={orderStatusForm.status}
//                     onChange={(e) => setOrderStatusForm({...orderStatusForm, status: e.target.value})}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 h-[42px]"
//                     onClick={handleUpdateOrderStatus}
//                     disabled={!orderStatusForm.order_id}
//                   >
//                     Update Status
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Orders List */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map(order => (
//                     <tr key={order.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {users.find(u => u.id === order.user_id)?.name || `User #${order.user_id}`}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total_amount}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(order.created_at).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           className="text-blue-600 hover:text-blue-900 mr-3"
//                           onClick={() => fetchOrderItems(order.id)}
//                         >
//                           View Items
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Order Items Modal */}
//           {orderItems.length > 0 && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
//                     <button
//                       className="text-gray-400 hover:text-gray-500"
//                       onClick={() => setOrderItems([])}
//                     >
//                       <span className="sr-only">Close</span>
//                       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     {orderItems.map(item => (
//                       <div key={item.id} className="border border-gray-200 rounded-lg p-4">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-medium text-gray-900">
//                               {products.find(p => p.id === item.product_id)?.name || `Product #${item.product_id}`}
//                             </h4>
//                             <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
//                             <p className="text-sm text-gray-500">Price: ${item.price_at_purchase}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Deliveries Tab */}
//       {activeTab === 'deliveries' && (
//         <div className="space-y-8">
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Delivery Management</h2>
//             </div>
            
//             {/* Create Delivery Form */}
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">Create New Delivery</h3>
//               <form onSubmit={handleCreateDelivery} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
//                   <select
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={deliveryForm.order_id}
//                     onChange={(e) => setDeliveryForm({...deliveryForm, order_id: e.target.value})}
//                     required
//                   >
//                     <option value="">Select Order</option>
//                     {orders.filter(o => o.status === 'processing' || o.status === 'pending').map(order => (
//                       <option key={order.id} value={order.id}>Order #{order.id}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={deliveryForm.carrier}
//                     onChange={(e) => setDeliveryForm({...deliveryForm, carrier: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={deliveryForm.tracking_number}
//                     onChange={(e) => setDeliveryForm({...deliveryForm, tracking_number: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
//                   <input
//                     type="url"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={deliveryForm.tracking_url}
//                     onChange={(e) => setDeliveryForm({...deliveryForm, tracking_url: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
//                   <input
//                     type="date"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     value={deliveryForm.estimated_delivery}
//                     onChange={(e) => setDeliveryForm({...deliveryForm, estimated_delivery: e.target.value})}
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                   >
//                     Create Delivery
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Deliveries List */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {deliveries.map(delivery => (
//                     <tr key={delivery.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{delivery.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Order #{delivery.order_id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <select
//                           className={`px-2 py-1 text-xs font-semibold rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                             delivery.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
//                             delivery.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-blue-100 text-blue-800'
//                           }`}
//                           value={delivery.delivery_status}
//                           onChange={(e) => handleUpdateDeliveryStatus(delivery.id, e.target.value)}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="processing">Processing</option>
//                           <option value="out_for_delivery">Out for Delivery</option>
//                           <option value="delivered">Delivered</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {delivery.carrier}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {delivery.tracking_number ? (
//                           delivery.tracking_url ? (
//                             <a href={delivery.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                               {delivery.tracking_number}
//                             </a>
//                           ) : (
//                             delivery.tracking_number
//                           )
//                         ) : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           className="text-red-600 hover:text-red-900"
//                           onClick={() => handleDeleteDelivery(delivery.id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ads Tab */}
//       {activeTab === 'ads' && (
//         <div className="space-y-8">
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Ad Management</h2>
//             </div>
            
//             {/* Create Ad Form */}
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">Create New Ad</h3>
//               <form onSubmit={handleCreateAd} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       value={adForm.title}
//                       onChange={(e) => setAdForm({...adForm, title: e.target.value})}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
//                     <select
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       value={adForm.product_id}
//                       onChange={(e) => setAdForm({...adForm, product_id: e.target.value})}
//                       required
//                     >
//                       <option value="">Select Product</option>
//                       {products.map(product => (
//                         <option key={product.id} value={product.id}>{product.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     rows="3"
//                     value={adForm.description}
//                     onChange={(e) => setAdForm({...adForm, description: e.target.value})}
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
//                     <input
//                       type="url"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       value={adForm.image_url}
//                       onChange={(e) => setAdForm({...adForm, image_url: e.target.value})}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//                     <select
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       value={adForm.position}
//                       onChange={(e) => setAdForm({...adForm, position: e.target.value})}
//                     >
//                       <option value="sidebar">Sidebar</option>
//                       <option value="homepage_banner">Homepage Banner</option>
//                       <option value="product_sidebar">Product Sidebar</option>
//                       <option value="checkout_footer">Checkout Footer</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="is_active"
//                     checked={adForm.is_active}
//                     onChange={(e) => setAdForm({...adForm, is_active: e.target.checked})}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
//                     Active
//                   </label>
//                 </div>
//                 <div>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Create Ad
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Ads List */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {ads.map(ad => (
//                     <tr key={ad.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ad.title}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {products.find(p => p.id === ad.product_id)?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{ad.position}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           ad.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {ad.is_active ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {ad.image_url && (
//                           <img 
//                             src={ad.image_url} 
//                             alt={ad.title}
//                             className="h-10 w-10 object-cover rounded"
//                           />
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           className="text-red-600 hover:text-red-900"
//                           onClick={() => handleDeleteAd(ad.id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <div className="flex items-center">
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span>Loading...</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;