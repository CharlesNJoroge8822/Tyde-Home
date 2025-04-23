# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






<!-- 


// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// // Admin Pages
// import Adminsettings from "./pages/admin/a-settings";
// import ManageProducts from "./pages/admin/manageproducts";
// import ManageUsers from "./pages/admin/manageusers";
// import DirectMsgs from "./pages/admin/directMsgs";
// import AdsPage from "./pages/admin/AdsPage";
// import DeliveriesPage from "./pages/admin/DeliveriesPage";

// // Client Pages
// import Items from "./pages/client/items";
// import MyOrders from "./pages/client/myOrders";
// import MessagePage from "./pages/client/messaging";

// // Public Pages
// import Register from "./pages/public/register";
// import Login from "./pages/public/login";
// import Landing from "./pages/public/landing";

// import Footer from "./components/footer";

// const Navbar = ({ logout }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);
  
//   const slideshowImages = [
//     'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
//     'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
//     'https://images.unsplash.com/photo-1600566752355-35792bedcfe3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <nav className="sticky top-0 z-50 w-full">
 

//       {/* Main Navbar Content */}
//       <div className="bg-blue-800/95 text-white shadow-xl w-full border-b-4 border-amber-600">
//         <div className="container mx-auto px-6">
//           {/* Top Row - Branding */}
//           <div className="flex justify-between items-center py-4">
//             <h2 className="text-4xl font-serif font-bold text-amber-100 tracking-wider hover:text-amber-300 transition-all duration-300">
//               <span className="text-5xl">T</span>yde Home Fittings & Sanitary Wares
//             </h2>
            
//             <div className="flex items-center space-x-2">
//               <Link 
//                 to="/login" 
//                 className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-medium transition-all duration-300 border border-blue-600 hover:border-amber-400"
//               >
//                 Login
//               </Link>
//               <button 
//                 onClick={logout}
//                 className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-medium transition-all duration-300 border border-amber-600 hover:border-white"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Bottom Row - Navigation */}
//           <div className="flex justify-between items-center py-3 border-t border-blue-700/50">
//             {/* Admin Links */}
//             <div className="flex space-x-6">
//               <Link to="/admin/ads" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">📢</span> Ads
//               </Link>
//               <Link to="/admin/deliveries" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">🚚</span> Deliveries
//               </Link>
//               <Link to="/admin/manage-users" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">👥</span> Users
//               </Link>
//               <Link to="/admin/manage-products" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">🛍️</span> Products
//               </Link>
//               <Link to="/admin/inbox" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">✉️</span> Inbox
//               </Link>
//             </div>

            

//             {/* Client Links */}
//             <div className="flex space-x-6">
//               <Link to="/client/items" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">🏠</span> Showroom
//               </Link>
//               <Link to="/client/my-orders" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">📦</span> My Orders
//               </Link>
//               <Link to="/client/messages" className="text-blue-100 hover:text-amber-300 transition-all duration-300 font-medium flex items-center">
//                 <span className="mr-1">💬</span> Messages
//               </Link>
//             </div>

            
//           </div>
//         </div>
//       </div>

//       <div>

//                      {/* Slideshow Background */}
//       {/* <div className="relative h-48 overflow-hidden bg-blue-900">
//         {slideshowImages.map((img, index) => (
//           <div 
//             key={index}
//             className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
//             style={{ backgroundImage: `url(${img})` }}
//           />
//         ))}
//         <div className="absolute inset-0 bg-blue-900/70"></div>
//       </div> */}
//       </div>
//     </nav>
//   );
// };

// const App = () => {
//   const logout = () => {
//     console.log("Logout clicked");
//     window.location.href = '/';
//   };

//   return (
//     <Router>
//       <div id="root">
//         <Navbar logout={logout} />
        
//         <div className="main-content container mx-auto mt-6 p-4">
//           <Routes>
//             {/* Public routes */}
//             <Route path="/" element={<Landing />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Client routes */}
//             <Route path="/client/items" element={<Items />} />
//             <Route path="/client/my-orders" element={<MyOrders />} />
//             <Route path="/client/messages" element={<MessagePage />} />

//             {/* Admin routes */}
//             <Route path="/admin/deliveries" element={<DeliveriesPage />} />
//             <Route path="/admin/ads" element={<AdsPage />} />
//             <Route path="/admin/manage-users" element={<ManageUsers />} />
//             <Route path="/admin/manage-products" element={<ManageProducts />} />
//             <Route path="/admin/settings" element={<Adminsettings />} />
//             <Route path="/admin/inbox" element={<DirectMsgs />} />

//             {/* Catch-all route */}
//             <Route path="*" element={<Landing />} />
//           </Routes>
//         </div>

//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;




// Tyde Home Fittings & Sanitary Wares



 -->
