import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaShieldAlt,
  FaTruck,
  FaStar,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaIndustry,
  FaWarehouse,
  FaTools,
  FaHistory,
  FaCertificate,
  FaLeaf,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWrench,
  FaChevronLeft,
  FaChevronRight,
  FaShower,
  FaNetworkWired,
  FaUtensils,
  FaLightbulb,
  FaSink
} from "react-icons/fa";
import { GiMetalBar, GiValve } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
// 1983
const Landing = () => {
  const [showNumber, setShowNumber] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Toggle phone number visibility
  const handleCallClick = () => {
    setShowNumber((prev) => !prev);
  };

  // Modal component
  const InteractModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
      <div className="h-70% inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-12 max-w-4xl w-full relative shadow-2xl border-t-8 border-blue-700 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        
        {/* ❌ Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-blue-800 text-4xl font-bold transition-transform hover:rotate-90"
          aria-label="Close contact modal"
        >
          &times;
        </button>
    
        {/* 🌟 Decorative Elements */}
        <div className="absolute -top-3 -left-3 w-16 h-16 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-blue-100 rounded-full opacity-30"></div>
        
        {/* 📢 Header */}
        <div className="text-center mb-10">
          <h3 className="text-4xl font-extrabold text-blue-800 mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Connect With Tyde Industrials
          </h3>
          <p className="text-xl text-gray-600">
            Premium Industrial Solutions & Seamless Ordering Experience
          </p>
        </div>
        {/* 40+ */}
        {/* 📱 Contact Info - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Direct Contact</h4>
                <p className="text-gray-600">Instant response during business hours</p>
              </div>
            </div>
            <ul className="space-y-3 pl-2">
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-3">📞</span>
                <div>
                  <p className="font-semibold">Sales Team</p>
                  <p className="text-gray-700">+254 712 345678</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-3">📱</span>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-gray-700">+254 712 345678</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-3">✉️</span>
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-gray-700">support@tydeindustrials.co.ke</p>
                </div>
              </li>
            </ul>
          </div>
    
          <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Business Hours</h4>
                <p className="text-gray-600">We're here when you need us</p>
              </div>
            </div>
            <ul className="space-y-3 pl-2">
              <li className="flex justify-between">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-gray-700">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Saturday</span>
                <span className="text-gray-700">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Sunday</span>
                <span className="text-gray-700">Emergency Only</span>
              </li>
              <li className="pt-2 text-sm text-blue-600">
                <span className="inline-block bg-blue-100 px-2 py-1 rounded">24/7 Emergency: +254 711 196 608</span>
              </li>
            </ul>
          </div>
        </div>
    
        {/* 🔐 Login Instructions - Enhanced */}
        <div className="bg-blue-50 border-l-4 border-blue-700 p-8 rounded-xl mb-10 shadow-inner relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-700 text-white p-2 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-blue-800">Your Digital Ordering Portal</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                  <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
                  Account Access
                </h5>
                <ul className="space-y-2 pl-8 text-gray-700">
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Register in under 2 minutes
                  </li>
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Business accounts available
                  </li>
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Password recovery option
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                  <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
                  Order Process
                </h5>
                <ul className="space-y-2 pl-8 text-gray-700">
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Real-time inventory updates
                  </li>
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Bulk order discounts
                  </li>
                  <li className="relative before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                    Order history tracking
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
              <h5 className="font-bold text-blue-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                Pro Tip
              </h5>
              <p className="text-gray-700">
                Save your frequent orders as templates for even faster reordering. Our system remembers your preferences for a personalized experience.
              </p>
            </div>
          </div>
        </div>
    
        {/* 🚚 Quick Order Section - Enhanced */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 rounded-xl text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-3">Express Emergency Service</h4>
              <p className="mb-4 text-blue-100">
                Need immediate assistance? Our rapid response team handles urgent orders 24/7 with same-day delivery options in Nairobi and surrounding areas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="font-semibold">Emergency Hotline</p>
                  <p className="text-xl">+254 712 999999</p>
                </div>
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="font-semibold">After Hours Support</p>
                  <p className="text-xl">emergency@tydeindustrials.co.ke</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-blue-200">
                When calling after hours, please have your customer ID or last order number ready for faster service.
              </p>
            </div>
          </div>
        </div>
    
        {/* 📍 Location Info (New Section) */}
        <div className="mt-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Visit My Office
          </h4>
          <p className="text-gray-700 mb-4">
           Connect With Me in person via addresses listed below : 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">📍 Main Office</p>
              <p className="text-gray-700">Tyde Towers, 5th Floor, Juja, Nairobi</p>
            </div>
            <div>
              <p className="font-semibold">🅿️ Parking</p>
              <p className="text-gray-700">Secure parking available and security checks</p>
            </div>
            <div>
              <p className="font-semibold">👔 Appointments</p>
              <p className="text-gray-700">Recommended for technical consultations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    );
  };

  // Product categories
  const categories = [
    { name: "Industrial Pipes", icon: <GiMetalBar size={40} />, count: 120 },
    { name: "Valves & Fittings", icon: <GiValve size={40} />, count: 85 },
    { name: "Tools & Equipment", icon: <FaWrench size={40} />, count: 65 },
    { name: "Safety Gear", icon: <FaShieldAlt size={40} />, count: 42 },
    { name: "Hydraulic Systems", icon: <FaTools size={40} />, count: 38 },
    { name: "Custom Fabrication", icon: <FaIndustry size={40} />, count: 27 },
    { name: "Bathroom Water Tab", icon: <FaShower size={40} />, count: 65 },
    { name: "Kitchen Utensils", icon: <FaUtensils size={40} />, count: 300 },
    { name: "Modern Light Bulbs", icon: <FaLightbulb size={40} />, count: 200 },
    { name: "Water Sinks", icon: <FaSink size={40} />, count: 150 }



  ];

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Stainless Steel Flange",
      description: "Heavy-duty 304 stainless steel flange with anti-corrosion treatment",
      price: "KSh 8,499",
      image: "/flange.jpeg",
      specs: ["DN50", "PN16", "ANSI B16.5"]
    },
    {
      id: 2,
      name: "Brass Gate Valve",
      description: "Full-port brass gate valve with chrome-plated handle",
      price: "KSh 12,999",
      image: "/gate2.jpeg",
      specs: ["1/2\" NPT", "200 PSI", "Lead-free"]
    },
    {
      id: 3,
      name: "Industrial Pipe Clamp",
      description: "Heavy-duty galvanized steel pipe clamp with rubber lining",
      price: "KSh 3,299",
      image: "/clamp.jpeg",
      specs: ["2\" Diameter", "Zinc-plated", "M10 Bolts"]
    },
    {
      id: 4,
      name: "PVC Pressure Pipe",
      description: "Schedule 40 PVC pipe for industrial fluid transport",
      price: "KSh 1,899/m",
      image: "/pvc.jpeg",
      specs: ["3\" Diameter", "Class 150", "UV-resistant"]
    },
    {
      id: 5,
      name: "Watertec Sanitary Ware",
      description: "Bathroom fitting for sanitary and water closet for taking a hot shower",
      price: "KSh 1,899/m",
      image: "/bathroomfilling.jpg",
      specs: ["3\" Diameter", "Class 150", "UV-resistant"]
    },
    {
      id: 6,
      name: "Water Sink",
      description: "Multipurpose water sink for home uses at affordable pricing",
      price: "KSh 1,899/m",
      image: "/sink.jpeg",
      specs: ["3\" Diameter", "Class 150", "UV-resistant"]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "James Kariuki",
      position: "Chief Engineer, Nairobi Water Co.",
      content: "Tyde Industrial has been our trusted supplier for 5 years. Their pipe fittings have withstood extreme pressure conditions at our treatment plants.",
      rating: 5
    },
    {
      name: "Susan Mwangi",
      position: "Project Manager, BuildRight Ltd",
      content: "The quality of their stainless steel products is exceptional. We've used their materials in three major industrial projects with zero failures.",
      rating: 5
    },
    {
      name: "David Omondi",
      position: "Maintenance Supervisor, Kenya Breweries",
      content: "Their 24/7 emergency supply service has saved us multiple times during plant shutdowns. Reliable doesn't begin to describe them.",
      rating: 4
    }
  ];

  // Gallery images
  const galleryImages = [
    { id: 1, src: "/public/warefac.jpeg", alt: "Our Warehouse Facility", caption: "State-of-the-art warehouse storage" },
    { id: 2, src: "/inspection1.jpeg", alt: "Quality Inspection", caption: "Rigorous quality control process" },
    { id: 3, src: "/delivery1.jpeg", alt: "Product Delivery", caption: "Timely nationwide delivery" },
    { id: 4, src: "/team1.jpeg", alt: "Our Expert Team", caption: "Dedicated technical team" },
    { id: 5, src: "/factory1.jpeg", alt: "Manufacturing Facility", caption: "Modern manufacturing equipment" },
    { id: 6, src: "/public/stafftrain.jpeg", alt: "Staff Training", caption: "Continuous staff training" }
  ];

  // Partners logos
  const partners = [
    { id: 1, name: "Kenya Pipeline", logo: "/partner1.png" },
    { id: 2, name: "Geothermal Development", logo: "/partner2.png" },
    { id: 3, name: "National Water", logo: "/partner3.png" },
    { id: 4, name: "Kenya Power", logo: "/partner4.png" },
    { id: 5, name: "Construction Authority", logo: "/partner5.png" }
  ];

  return (
    <div className="bg-blue-50 font-serif">
      {/* Hero Section (Original Version) */}
      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/public/tyde.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-100 mb-6 leading-tight">
            <span className="text-blue-400">Tyde</span> Home Fittings, Sanitary Wares & Supplies
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            We've provided the toughest, most reliable industrial components to Kenya's toughest industries
          </p>

          <div className="flex gap-4 justify-center">
            <button className="bg-blue-800 hover:bg-blue-500 text-blue-300 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg">
              <FaShoppingCart /> Browse Catalog
            </button>

            <button className="bg-transparent border-2 border-blue-400 hover:bg-blue-400 hover:text-gray-900 text-blue-400 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 flex items-center gap-2">
              <FaPhoneAlt /> Emergency Order
            </button>
          </div>
        </div>
      </section>
      {/* Industrial Solutions */}
      {/* Quick Stats Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">6+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">2,124+</div>
              <div className="text-blue-200">Satisfied Clients</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">245+</div>
              <div className="text-blue-200">Product Lines</div>
            </div>
          </div>
        </div>
      </section>
      {/* Comprehensive range of industrial components for every application */}
      {/* About Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <img 
              src="/3.jpeg" 
              alt="Our Foundry" 
              className="rounded-lg shadow-xl w-full h-auto border-4 border-blue-800"
            />
            <div className="absolute -bottom-8 -right-8 bg-blue-800 text-white p-6 rounded-lg shadow-xl">
              <FaHistory className="text-4xl mb-2" />
              <p className="font-bold text-xl">Time Effective</p>
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              <span className="text-blue-700">Forged</span> in Excellence
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Founded by industrial engineer Michael Ochieng, Tyde Industrial began as a small machine shop in Mombasa's industrial area. 
              Today, we operate Kenya's largest stock of industrial fittings with three distribution centers nationwide.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our products have powered Kenya's industrial growth for four decades, from the first oil pipelines to modern geothermal plants.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              Interact With Us <IoIosArrowForward />
            </button>
          </div>
        </div>

        <InteractModal show={modalOpen} onClose={() => setModalOpen(false)} />
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-blue-900 text-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">
            Industrial <span className="text-blue-300">Solutions</span>
          </h2>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
            Comprehensive range of industrial components for every application
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-blue-800 bg-opacity-50 p-8 rounded-xl hover:bg-opacity-70 transition-all duration-300 group">
                <div className="text-blue-300 mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-blue-100 mb-4">{category.count} products available</p>
                {/* <button className="text-blue-300 hover:text-blue-100 font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                  View Products <FaArrowRight />
                </button> */}
                <p>Waiting For You </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-blue-700">Featured</span> Industrial Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by Kenya's largest industrial operations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-200">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <span className="text-white font-bold">{product.price}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="mb-4">
                  {product.specs.map((spec, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 flex items-center gap-2">
                    <FaShoppingCart size={14} /> Product
                  </button>
                  <button className="text-blue-700 hover:text-blue-900 font-semibold text-sm">
                   Available Now!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/register">
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 inline-flex items-center gap-2">
              Register To Start Place Orders, NOW! <FaArrowRight />
            </button>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-blue-700">Facilities</span> & Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A glimpse into our world-class infrastructure and processes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg h-64">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{image.caption}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                <span className="text-blue-700">Industrial Grade</span> Quality
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Every component in our inventory meets or exceeds international industrial standards. 
                We source only from ISO-certified manufacturers and conduct rigorous in-house testing.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaCertificate className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Certified Materials</h3>
                    <p className="text-gray-600">
                      All metals come with mill test certificates and traceability documentation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaShieldAlt className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pressure Testing</h3>
                    <p className="text-gray-600">
                      Hydrostatic and pneumatic testing available on-site for critical applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaLeaf className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Environmental Compliance</h3>
                    <p className="text-gray-600">
                      ROHS-compliant materials available for environmentally sensitive projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img src="/inspeact.jpeg" alt="Quality Inspection" className="rounded-lg shadow-md h-64 w-full object-cover border-2 border-blue-700" />
                <img src="/testing.jpeg" alt="Material Testing" className="rounded-lg shadow-md h-64 w-full object-cover border-2 border-blue-700" />
                <img src="/Certification.jpeg" alt="Certification" className="rounded-lg shadow-md h-64 w-full object-cover border-2 border-blue-700" />
                <img src="/Warehouse.jpeg" alt="Warehouse" className="rounded-lg shadow-md h-64 w-full object-cover border-2 border-blue-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Trusted By Industry Leaders
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner) => (
              <div key={partner.id} className="w-32 h-20 flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white-100 text-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">
            Trusted by <span className="text-blue-700">Industry Leaders</span>
          </h2>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-blue-700">
            What Kenya's top industrial professionals say about our products
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-blue-700 p-8 rounded-xl hover:bg-opacity-70 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-blue-900"} />
                  ))}
                </div>
                <p className="text-white mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-blue-200 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/industrial-pattern.png')] opacity-10"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="text-blue-400">Power Your Projects</span>?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Contact our industrial specialists today for bulk pricing, technical specifications, and emergency orders
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <FaPhoneAlt /> Call Now
            </button>

            <button className="bg-transparent border-2 border-blue-400 hover:bg-blue-400 hover:text-gray-900 text-blue-400 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 flex items-center gap-2">
              <FaEnvelope /> Request Quote
            </button>
          </div>

          {showNumber && (
            <div className="mt-6 inline-block bg-white text-gray-800 px-6 py-4 rounded-lg shadow-md border border-gray-300 transition-all duration-500">
              📞 Call us at: <strong>(+254)-711-196-608</strong>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;