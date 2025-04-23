import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, NavLink } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaTruck, FaAd, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaShoppingCart, FaUserCircle, FaScroll, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

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
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAdmin() ? '/admin/manage-products' : '/client/items');
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-800 font-sans">Redirecting...</h1>
    </div>
  );
};

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/client/items" replace />;
  }
  return children;
};

const ClientRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin()) {
    return <Navigate to="/admin/manage-products" replace />;
  }
  return children;
};

const NavLinkItem = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
        isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
      }`
    }
  >
    {React.cloneElement(icon, { className: "mr-3 text-lg" })}
    <span className="font-medium">{text}</span>
  </NavLink>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NAV_SLIDES = [
    'Crafted Elegance in Every Drop ✦',
    'Summer Sale – 20% Off All Bath Collections ✦',
    'Free Delivery on Orders Over $50 ✦',
    'Premium Quality Since 1892 ✦',
  ];


  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://tyde-home.onrender.com/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('role', response.data.user.is_admin ? 'admin' : 'client');
      localStorage.setItem('email', response.data.user.email);
      setUser({
        email: response.data.user.email,
        isAdmin: response.data.user.is_admin
      });
    } catch (err) {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const renderLinks = () => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        return (
          <>
            <NavLinkItem to="/admin/manage-products" icon={<FaBox />} text="Products" />
            <NavLinkItem to="/admin/manage-users" icon={<FaUsers />} text="Users" />
            <NavLinkItem to="/admin/deliveries" icon={<FaTruck />} text="Deliveries" />
            <NavLinkItem to="/admin/ads" icon={<FaAd />} text="Ads" />
            <NavLinkItem to="/admin/orders" icon={<FaScroll />} text="Orders" />
            <NavLinkItem to="/admin/directMsgs" icon={<FaEnvelope />} text="Messages" />
          </>
        );
      } else {
        return (
          <>
            <NavLinkItem to="/client/items" icon={<FaBox />} text="Shop" />
            <NavLinkItem to="/client/my-orders" icon={<FaShoppingCart />} text="My Orders" />
            <NavLinkItem to="/client/messages" icon={<FaEnvelope />} text="Messages" />
            <NavLinkItem to="/client/profile" icon={<FaUserCircle />} text="Profile" />
          </>
        );
      }
    } else {
      return (
        <NavLinkItem to="/" icon={<FaHome />} text="Home" />
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-blue-800 text-xl font-sans">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Navigation */}
      <nav className="relative w-[90%] mx-auto bg-gradient-to-r from-blue-400 via-blue-900 to-blue-400 text-white shadow-2xl sticky top-0 z-50 font-sans ">
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
    <Link to="/" className="flex items-center space-x-3 group transform hover:scale-110 transition-transform duration-500">
      <span className="text-5xl md:text-6xl font-extrabold text-white hover:text-blue-600 transition-all duration-300 tracking-tight drop-shadow-2xl">
        TYDE
      </span>
      <span className="text-lg md:text-xl text-blue-100 italic font-light hidden md:block bg-blue-700/50 px-3 py-1 rounded-lg group-hover:bg-blue-800/70 transition-all duration-500">
        Homes & Sanitary Wares
      </span>
    </Link>

          {/* Crafted */}
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {renderLinks()}
          </div>
          {/* Premium */}
          {/* Auth Buttons Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated() ? (
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg transition-all duration-300 shadow hover:shadow-xl group"
              >
                <FaSignOutAlt className="mr-2 text-lg group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                >
                  <FaSignInAlt className="mr-2" />
                  <span className="font-medium">Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                >
                  <FaUserPlus className="mr-2" />
                  <span className="font-medium">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden text-3xl text-white focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Slide Caption Banner */}
        <div className="mt-6 text-center rounded-md px-6 py-3 text-sm md:text-base font-medium text-blue-100 tracking-wide italic transition-all duration-700 ease-in-out min-h-[40px] flex items-center justify-center">
          <span className="animate-fade">{NAV_SLIDES[currentSlide]}</span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-blue-700 transition-all duration-300 overflow-hidden ${
        mobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0'
      }`}>
        <div className="container mx-auto px-6 space-y-3">
          {renderLinks()}
          {isAuthenticated() ? (
            <button 
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/login" 
                className="flex items-center justify-center px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link 
                to="/register" 
                className="flex items-center justify-center px-4 py-2 bg-sky-800 hover:bg-sky-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Promo Marquee */}
      <div className="bg-gradient-to-r from-transparent via-blue-900 to-transparent overflow-hidden mt-2 rounded-2xl">
  <div className="py-2">
    <div className="animate-marquee whitespace-nowrap text-blue-100 text-sm font-semibold italic text-center mx-auto">
      <span className="mx-8">✦ Premium Quality... ✦</span>
      <span className="mx-8">Free Delivery on Orders Over $50 ✦</span>
      <span className="mx-8">Summer Sale - 20% Off All Bath Collections ✦</span>
    </div>
  </div>
</div>

    </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={isAuthenticated() ? 
              (isAdmin() ? 
                <Navigate to="/admin/manage-products" replace /> : 
                <Navigate to="/client/items" replace />) : 
              <Login setUser={setUser} verifyAuth={verifyAuth} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated() ? 
              (isAdmin() ? 
                <Navigate to="/admin/manage-products" replace /> : 
                <Navigate to="/client/items" replace />) : 
              <Register />} 
          />
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