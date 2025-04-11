// // src/contexts/OrderContext.js

// import React, { createContext, useState, useContext, useEffect } from "react";
// import axios from "axios";

// const OrderContext = createContext();

// export const useOrderContext = () => {
//   return useContext(OrderContext);
// };

// export const OrderProvider = ({ children }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch orders when the component mounts
//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("/api/orders");
//         setOrders(response.data);
//       } catch (err) {
//         setError("Error fetching orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const createOrder = async (newOrder) => {
//     try {
//       const response = await axios.post("/api/orders", newOrder);
//       setOrders([...orders, response.data.order]);
//     } catch (err) {
//       setError("Error creating order.");
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const response = await axios.patch(`/api/orders/${orderId}`, { status });
//       const updatedOrders = orders.map((order) =>
//         order.id === orderId ? response.data.order : order
//       );
//       setOrders(updatedOrders);
//     } catch (err) {
//       setError("Error updating order.");
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       await axios.delete(`/api/orders/${orderId}`);
//       const updatedOrders = orders.filter((order) => order.id !== orderId);
//       setOrders(updatedOrders);
//     } catch (err) {
//       setError("Error deleting order.");
//     }
//   };

//   return (
//     <OrderContext.Provider
//       value={{ orders, createOrder, updateOrderStatus, deleteOrder, loading, error }}
//     >
//       {children}
//     </OrderContext.Provider>
//   );
// };
