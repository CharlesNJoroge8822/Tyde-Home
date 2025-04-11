import React, { useState, useContext } from "react";
import { UserContext } from "../../context/usercontext";
import { FaUserPlus, FaLock, FaEnvelope, FaUser, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { createUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [toast, setToast] = useState({ visible: false, message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error } = await createUser(formData);

    if (success) {
      setMessage({ type: "success", text: "User registered successfully!" });
      setFormData({
        name: "",
        email: "",
        password: "",
        is_admin: false,
      });

      // Show toast with message and start redirect countdown
      setToast({ visible: true, message: "Registering... Please wait." });

      // After 2 seconds, update message to show redirecting info
      setTimeout(() => {
        setToast({ visible: true, message: "Redirecting to login..." });

        // Redirect to login page after 7 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000); // Redirect after 5 seconds, total 7 seconds delay
      }, 2000); // Change to "Redirecting to login..." after 2 seconds
    } else {
      setMessage({ type: "error", text: error });
    }
  };
// src
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/images/antique-paper-bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl w-full max-w-md border-2 border-blue-800 relative overflow-hidden">
        
        {/* Antique decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-800 opacity-10 rounded-full transform translate-x-10 translate-y-10"></div>
        <div className="absolute top-10 left-10 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
        
        <div className="text-center mb-8 relative z-10">
          <FaUserPlus className="mx-auto text-5xl text-blue-700 mb-4" />
          <h2 className="text-3xl font-bold text-blue-800 mb-2 font-serif tracking-wider">
            Create Account
          </h2>
          <p className="text-blue-600 italic">Join our antique collectors community</p>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg border-l-4 ${
            message.type === "success" 
              ? "bg-green-50 border-green-500 text-green-700" 
              : "bg-red-50 border-red-500 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Toast Notification */}
        {toast.visible && (
          <div className="fixed top-5 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
            <p>{toast.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-blue-600" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-blue-600" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400"
              placeholder="Your Email Address"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-blue-600" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400"
              placeholder="Create Password"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${formData.is_admin ? 'bg-blue-700' : 'bg-blue-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition transform ${formData.is_admin ? 'translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 flex items-center text-blue-800">
                <FaCrown className="mr-2" />
                <span className="font-medium">Admin Privileges</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 font-serif text-lg tracking-wider flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" />
            Register Now
          </button>

          <div className="text-center pt-4 border-t border-blue-200">
            <p className="text-blue-700">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-semibold hover:text-blue-800 hover:underline">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;