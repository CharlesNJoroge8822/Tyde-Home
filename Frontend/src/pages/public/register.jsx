import React, { useState, useContext } from "react";
import { UserContext } from "../../context/usercontext";
import { FaUserPlus, FaLock, FaEnvelope, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { createUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [toast, setToast] = useState({ visible: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        phone: "",
        address: ""
      });

      // Show toast with message and start redirect countdown
      setToast({ visible: true, message: "Registering... Please wait." });

      // After 2 seconds, update message to show redirecting info
      setTimeout(() => {
        setToast({ visible: true, message: "Redirecting to login..." });

        // Redirect to login page after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }, 2000);
    } else {
      setMessage({ type: "error", text: error });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" 
      style={{ backgroundImage: "url('/images/antique-paper-bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-2xl border-2 border-blue-800 relative overflow-hidden">
        
        {/* Antique decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-800 opacity-10 rounded-full transform translate-x-12 translate-y-12"></div>
        <div className="absolute top-12 left-12 w-20 h-20 border-4 border-blue-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-12 left-12 w-8 h-8 bg-blue-600 opacity-10 rounded-full"></div>
        
        <div className="text-center mb-8 relative z-10">
          <FaUserPlus className="mx-auto text-5xl text-blue-700 mb-4" />
          <h2 className="text-4xl font-bold text-blue-800 mb-2 font-serif tracking-wider">
            Join Our Community
          </h2>
          <p className="text-blue-600 italic text-lg">Register to explore antique treasures</p>
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
          <div className="fixed top-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-pulse mr-2">✨</div>
            <p className="font-medium">{toast.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400 text-lg"
                placeholder="Full Name"
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
                className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400 text-lg"
                placeholder="Email Address"
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
                className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400 text-lg"
                placeholder="Password"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-blue-600" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400 text-lg"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <FaMapMarkerAlt className="text-blue-600" />
              </div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="block w-full pl-10 pr-3 py-3 border-b-2 border-blue-300 bg-transparent focus:border-blue-600 focus:outline-none placeholder-blue-400 text-lg"
                placeholder="Full Address"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 font-serif text-xl tracking-wider flex items-center justify-center"
            >
              <FaUserPlus className="mr-3 text-xl" />
              Complete Registration
            </button>
          </div>

          <div className="text-center pt-6 border-t border-blue-200">
            <p className="text-blue-700 text-lg">
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