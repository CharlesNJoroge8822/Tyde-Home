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










import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaTruck, FaAd, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaJediOrder, FaFacebook } from "react-icons/fa";

// Admin Pages
import ManageProducts from "./pages/admin/manageproducts";
import ManageUsers from "./pages/admin/manageusers";
import DirectMsgs from "./pages/admin/directMsgs";
import AdsPage from "./pages/admin/AdsPage";
import DeliveriesPage from "./pages/admin/DeliveriesPage";
import Orders from "./pages/admin/Orders";

// Client Pages
import Items from "./pages/client/items";
import MyOrders from "./pages/client/myOrders";
import MessagePage from "./pages/client/messaging";
import Profile from "./pages/client/profileUser";

// Public Pages
import Register from "./pages/public/register";
import Login from "./pages/public/login";
import Landing from "./pages/public/landing";

import Footer from "./components/footer";

const isAuthenticated = () => !!localStorage.getItem('token');
const isAdmin = () => localStorage.getItem('role') === 'admin';

const AccessDenied = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = isAdmin() ? '/admin/manage-products' : '/client/items';
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-800 font-serif">Redirecting...</h1>
    </div>
  );
};

const AdminRoute = ({ children }) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    if (!isAdmin()) {
      window.location.href = '/client/items';
      return;
    }
    setVerified(true);
  }, []);

  return verified ? children : null;
};

const ClientRoute = ({ children }) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    if (isAdmin()) {
      window.location.href = '/admin/manage-products';
      return;
    }
    setVerified(true);
  }, []);

  return verified ? children : null;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await axios.get('/api/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.setItem('role', response.data.user.is_admin ? 'admin' : 'client');
        
        const currentPath = window.location.pathname;
        if (response.data.user.is_admin && !currentPath.startsWith('/admin')) {
          window.location.href = '/admin/manage-products';
        } else if (!response.data.user.is_admin && !currentPath.startsWith('/client')) {
          window.location.href = '/client/items';
        }
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-blue-800 text-xl font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Antique-style navigation */}
      <nav
  className="relative bg-blue-900/50 backdrop-blur-md text-white shadow-lg border-b-4 border-blue-700 sticky top-0 z-50"
  style={{
    backgroundImage: "url('/public/navbg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  }}
>        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-blue-300 font-serif">TYDE</span>
              <span className="text-xl text-white italic">Home & Sanitary</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
              >
                <FaHome className="mr-2" /> Home
              </Link>

              {isAuthenticated() ? (
                isAdmin() ? (
                  <>
                    <Link 
                      to="/admin/manage-products" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaBox className="mr-2" /> Products
                    </Link>
                    <Link 
                      to="/admin/manage-users" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaUsers className="mr-2" /> Users
                    </Link>
                    <Link 
                      to="/admin/deliveries" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaTruck className="mr-2" /> Deliveries
                    </Link>
                    <Link 
                      to="/admin/ads" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaAd className="mr-2" /> Ads
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaAd className="mr-2" /> Orders
                    </Link>
                    <Link 
                      to="/admin/directMsgs" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaEnvelope className="mr-2" /> Messages
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/client/items" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaBox className="mr-2" /> Products
                    </Link>
                    <Link 
                      to="/client/my-orders" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaTruck className="mr-2" /> My Orders
                    </Link>
                    <Link 
                      to="/client/messages" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaEnvelope className="mr-2" /> Messages
                    </Link>

                    <Link 
                      to="/client/profile" 
                      className="flex items-center px-3 py-2 text-blue-100 hover:text-white transition-colors"
                    >
                      <FaFacebook className="mr-2" /> Profile
                    </Link>
                  </>
                )
              ) : null}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated() ? (
                <button 
                  onClick={logout}
                  className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
                  >
                    <FaSignInAlt className="mr-2" /> Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                  >
                    <FaUserPlus className="mr-2" /> Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Admin routes */}
          <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
          <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/deliveries" element={<AdminRoute><DeliveriesPage /></AdminRoute>} />
          <Route path="/admin/ads" element={<AdminRoute><AdsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/admin/directMsgs" element={<AdminRoute><DirectMsgs /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute><Navigate to="/admin/manage-products" replace /></AdminRoute>} />

          {/* Client routes */}
          <Route path="/client/items" element={<ClientRoute><Items /></ClientRoute>} />
          <Route path="/client/my-orders" element={<ClientRoute><MyOrders /></ClientRoute>} />
          <Route path="/client/messages" element={<ClientRoute><MessagePage /></ClientRoute>} />
          <Route path="/client/profile" element={<ClientRoute><Profile /></ClientRoute>} />
          <Route path="/client" element={<ClientRoute><Navigate to="/client/items" replace /></ClientRoute>} />
          {/* <Route path="/client/profile" element={<ClientRoute><Navigate to="/client/profile" eplace /></ClientRoute>} /> */}


          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;