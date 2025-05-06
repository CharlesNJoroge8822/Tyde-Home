import React, { useState, useEffect } from "react";
import LazyLoad from 'react-lazyload';
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
  FaBoxTissue,
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
  FaSink,
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaToilet,
  FaDoorOpen,
  FaBath,
  FaWhatsapp,
  FaUserPlus
} from "react-icons/fa";
import { GiMetalBar, GiValve, GiWaterDrop } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { FaExclamationTriangle } from "react-icons/fa";

const Landing = () => {
  const [showNumber, setShowNumber] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
// tyde
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // Dedicated technical team

  const homeCategories = [
    {
      id: 1,
      name: "Water Sinks",
      icon: <FaSink size={40} />,
      items: [
        {
          id: 101,
          name: "Stainless Steel Sink",
          description: "Premium grade 304 stainless steel kitchen sink",
          price: "KSh 15,999",
          image: "/si1.jpeg",
          specs: ["Double Bowl", "18 Gauge", "Soundproof"],
          liked: false
        },
        {
          id: 102,
          name: "Ceramic Farmhouse Sink",
          description: "Elegant white ceramic sink with apron front",
          price: "KSh 22,500",
          image: "/si3.jpeg",
          specs: ["Single Bowl", "Undermount", "Scratch-resistant"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/new1.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si4.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si5.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si6.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si7.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si8.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        },
        {
          id: 103,
          name: "Granite Composite Sink",
          description: "Durable granite composite material with heat resistance",
          price: "KSh 28,750",
          image: "/si9.jpeg",
          specs: ["Double Bowl", "Heat-resistant", "Stain-proof"],
          liked: false
        }
      ]
    },
    {
      id: 2,
      name: "Toilets",
      icon: <FaToilet size={40} />,
      items: [
        {
          id: 201,
          name: "One-Piece Toilet",
          description: "Modern one-piece design with soft-close seat",
          price: "KSh 32,000",
          image: "/t1.jpeg",
          specs: ["Dual Flush", "Elongated Bowl", "WaterSense Certified"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t2.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        }
        ,
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t3.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t4.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t5.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t6.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t7.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t8.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t9.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t10.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        },
        {
          id: 202,
          name: "Wall-Hung Toilet",
          description: "Space-saving wall-mounted toilet",
          price: "KSh 45,000",
          image: "/t3.jpeg",
          specs: ["Concealed Cistern", "Easy Clean", "Modern Design"],
          liked: false
        }
      ]
    },
    {
      id: 3,
      name: "Taps & Faucets",
      icon: <GiWaterDrop size={40} />,
      items: [
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf1.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 302,
          name: "Waterfall Bathroom Faucet",
          description: "Luxury waterfall spout with ceramic disc",
          price: "KSh 18,200",
          image: "/tf2.jpeg",
          specs: ["Single Lever", "Brass Construction", "Modern Design"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf3.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf4.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf5.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf6.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf7.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf9.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf10.webp",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf11.webp",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf8.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },,
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf10.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf11.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf12.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf13.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        }, 
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf14.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        },
        {
          id: 301,
          name: "Sensor Kitchen Tap",
          description: "Touchless operation for hygiene",
          price: "KSh 12,500",
          image: "/tf15.jpeg",
          specs: ["Motion Sensor", "Battery Operated", "Adjustable Flow"],
          liked: false
        }
      ]
    },
    {
      id: 4,
      name: "Showers",
      icon: <FaShower size={40} />,
      items: [
        {
          id: 401,
          name: "Rain Shower System",
          description: "Luxury overhead rainfall shower experience",
          price: "KSh 37,800",
          image: "/s1.jpeg",
          specs: ["8-inch Head", "Thermostatic Control", "Brass Construction"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s2.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s6.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },

        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s4.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s5.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s3.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s7.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s8.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        }
        ,
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s9.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s10.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s15.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s16.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s17.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s18.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s19.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        },
        {
          id: 402,
          name: "Handheld Shower Set",
          description: "Adjustable shower with multiple spray patterns",
          price: "KSh 15,300",
          image: "/s20.jpeg",
          specs: ["5 Settings", "Rubber Nozzles", "Easy Install"],
          liked: false
        }
      ]
    },
    {
      id: 5,
      name: "Door Hardware",
      icon: <FaDoorOpen size={40} />,
      items: [
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/door1.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        }
      ]
    },
    {
      id: 6,
      name: "Bathroom Accessories",
      icon: <FaBath size={40} />,
      items: [
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b1.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b2.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b3.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b4.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b5.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b6.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b7.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b8.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b10.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b11.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b12.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b13.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b14.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b15.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b16.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b17.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b18.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b19.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b20.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        },
        {
          id: 601,
          name: "Towel Rail Heated",
          description: "Luxury heated towel rail",
          price: "KSh 24,900",
          image: "/b21.jpeg",
          specs: ["500W", "Thermostat Control", "Stainless Steel"],
          liked: false
        }
      ]
    },
    {
      id: 7,
      name: "Toilet Tissue Paper Holders",
      icon: <FaBoxTissue size={40} />,
      items: [
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p1.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p2.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        }
        ,
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p3.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p4.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p5.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p6.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p7.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p8.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p9.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p10.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        },
        {
          id: 501,
          name: "Modern Door Handle Set",
          description: "Sleek contemporary door handles",
          price: "KSh 8,400",
          image: "/p11b.jpeg",
          specs: ["Stainless Steel", "Includes Lockset", "Various Finishes"],
          liked: false
        }
      ]
    }
  ];

  // Toggle phone number visibility
  const handleCallClick = () => {
    setShowNumber((prev) => !prev);
  };

  // Open category modal
  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  // Close category modal
  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
  };


  const slideshowImages = [
    "/b19.jpeg",
    "/p9.jpeg",
    "/s1.jpeg",
    "/p6.jpeg",
    "/b19.jpeg",
    "/p9.jpeg",
    "/s1.jpeg",
    "/p6.jpeg", 
    "/b19.jpeg",
    "/p9.jpeg",
    "/s1.jpeg",
    "/p6.jpeg", 
    "/b19.jpeg",
    "/p9.jpeg",
    "/s1.jpeg",
    "/p6.jpeg",
  ];
  
  
  // Toggle like status for an item
  const toggleLike = (itemId) => {
    setLikedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Modal component for contact
  const InteractModal = ({ show, onClose }) => {
    if (!show) return null;

    return (

<div className="h-70% inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-12 max-w-4xl w-full relative shadow-2xl border-t-8 border-blue-700 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-blue-800 text-4xl font-bold transition-transform hover:rotate-90"
            aria-label="Close contact modal"
          >
            &times;
          </button>
      
          <div className="absolute -top-3 -left-3 w-16 h-16 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-blue-100 rounded-full opacity-30"></div>
          
          <div className="text-center mb-10">
            <h3 className="text-4xl font-extrabold text-blue-800 mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Connect With Tyde Industrials
            </h3>
            <p className="text-xl text-gray-600">
              Premium Industrial Solutions & Seamless Ordering Experience
            </p>
          </div>
          
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
                {/*Premium home fittings  */}
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

 // Category Modal Component with Image Zoom and Fixed Close Button
const CategoryModal = ({ category, onClose }) => {
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!category) return null;

  // Close modal when clicking outside content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Open zoomed view for an image
  const openZoomedView = (imgSrc, index) => {
    setZoomedImage(imgSrc);
    setCurrentIndex(index);
  };

  // Navigate through zoomed images
  const navigateZoomed = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % category.items.length 
      : (currentIndex - 1 + category.items.length) % category.items.length;
    
    setCurrentIndex(newIndex);
    setZoomedImage(category.items[newIndex].image);
  };

  return (
    <>
     {/* Main Modal */}
<div 
  className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
  onClick={handleOverlayClick}
>
  <div className="bg-gray/90 backdrop-blur-sm rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-200/50">
   {/* Modal Header */}
<div className="sticky top-0 bg-blue-50/90 backdrop-blur-sm z-10 px-8 py-6 border-b border-blue-200 flex justify-between items-center shadow-sm">
  <div>
    <h3 className="text-3xl font-serif font-medium text-blue-900 tracking-wide">
      {category.name} Collection
    </h3>
    <p className="text-blue-600/80 text-sm mt-1 font-light italic">Curated with timeless elegance</p>
    <div className="mb-6">
  <div className="flex items-center gap-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 rounded-md shadow-sm animate-pulse">
    <FaExclamationTriangle className="text-xl" />
    <p className="text-sm font-semibold">
      If images don't show, please reload the page to load images properly.
    </p>
  </div>
</div>  </div>
  <button 
    onClick={(e) => {
      e.stopPropagation();
      openCategoryModal();
    }}
    className="text-blue-400 hover:text-blue-700 text-2xl transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95"
    aria-label="Close modal"
  >
    <FaTimes />
  </button>
</div>
{/* Modal Content - Gallery View */}
<div className="p-8 bg-blue-50 min-h-screen">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {category.items.map((item, index) => (
      <LazyLoad key={item.id} height={300} offset={100} once>
        <div 
          className="bg-white border border-blue-100 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        >
          <div 
            className="relative h-90 overflow-hidden cursor-zoom-in group"
            onClick={() => openZoomedView(item.image, index)}
          >
            <img 
              src={item.image} 
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <span className="text-white font-medium text-sm bg-blue-900/60 px-3 py-1.5 rounded-full border border-blue-300/30">
                Click to enlarge
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-blue-900/80 text-white text-xs px-2 py-1 rounded-full border border-blue-300/30 hidden group-hover:block animate-fade-in">
              View Image
            </div>
          </div>

          <div className="p-6 border-t border-blue-50">
            <h4 className="text-xl font-serif font-medium text-blue-900 mb-2">{item.name}</h4>
            <p className="text-blue-700/80 text-sm mb-4 leading-relaxed font-light">{item.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {item.specs.map((spec, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-blue-50">
              <span className="text-lg font-serif font-medium text-blue-900">{item.price}</span>

              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors">
                <div className="flex gap-3 mt-2">
                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/254746623859?text=Hi, I'm interested in the ${item.name} (${item.specs.join(", ")}) priced at ${item.price}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700 border border-green-700 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <FaWhatsapp className="text-base" />
                    WhatsApp
                  </a>
{/* Curated with timeless elegance */}
                  {/* Create Account Button */}
                  <a
                    href="/register"
                    className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 border border-blue-700 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <FaUserPlus className="text-base" />
                    Create Account
                  </a>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </LazyLoad>
    ))}
  </div>
</div>
    
    {/* Modal Footer */}
    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200/50 p-4 flex justify-between items-center">
      <div className="text-gray-600 text-sm">
        Showing {category.items.length} items in {category.name}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          openCategoryModal();
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all hover:shadow-md active:scale-95"
      >
        Close Gallery
      </button>
    </div>
  </div>
</div>

      {/* Zoomed Image View */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-red-400 text-4xl transition-colors"
            aria-label="Close zoom"
          >
            <FaTimes />
          </button>
          
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <button 
              onClick={() => navigateZoomed('prev')}
              className="absolute left-4 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-40 transition-all z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft size={24} />
            </button>
            
            <img 
              src={zoomedImage} 
              alt="Zoomed view" 
              className="max-h-full max-w-full object-contain"
            />
            
            <button 
              onClick={() => navigateZoomed('next')}
              className="absolute right-4 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-40 transition-all z-10"
              aria-label="Next image"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-white">
            {currentIndex + 1} of {category.items.length}
          </div>
        </div>
      )}
    </>
  );
};

  // Testimonials
  const testimonials = [
    {
      name: "Paul Maina",
      position: "Tyde Homes And Fittings",
      content: "Tyde Industrial has been our trusted supplier. Their pipe fittings have withstood extreme pressure conditions at our treatment plants.",
      rating: 5
    },
    {
      name: "Moses Njoroge",
      position: "Sons Of Men Coop.",
      content: "The quality of their stainless steel products is exceptional. We've used their materials in three major industrial projects with zero failures.",
      rating: 5
    },
    {
      name: "Luqman Bashir",
      position: "The Charles Factor",
      content: "Their 24/7 emergency supply service has saved us multiple times during plant shutdowns. Reliable doesn't begin to describe them.",
      rating: 4
    }
  ];

  // Gallery images
  const galleryImages = [
    { id: 1, src: "/storagefac.jpg", alt: "Our Warehouse Facility", caption: "State-of-the-art warehouse storage" },
    { id: 2, src: "/qi.png", alt: "Quality Inspection", caption: "Rigorous quality control process" },
    { id: 3, src: "/delivery.jpg", alt: "Product Delivery", caption: "Timely nationwide delivery" },
    { id: 4, src: "/teamwork.jpeg", alt: "Our Expert Team", caption: "Dedicated technical team" },
    { id: 5, src: "/facilityin.jpg", alt: "Facility Interior", caption: "Where Excellence Begins" },
    { id: 6, src: "/stafftrain.jpeg", alt: "Staff Training", caption: "Continuous staff training" }
  ];

  // Partners logos
  const partners = [
    { id: 1, name: "Kenya Pipeline", logo: "/f1.jpeg" },
    { id: 2, name: "Geothermal Development", logo: "/f2.jpeg" },
    { id: 3, name: "National Water", logo: "/f3.jpeg" },
    { id: 4, name: "Kenya Power", logo: "/f4.jpeg" },
    { id: 5, name: "Construction Authority", logo: "/f5.jpeg" }
  ];

  return (
    <div className="bg-blue-50 font-serif">
      {/* Hero Section */}
      <section
  className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
  style={{ backgroundImage: "url('/tyde.jpeg')" }}
>
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>

  <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
    <h1 className="text-5xl md:text-7xl font-bold text-blue-100 mb-6 leading-tight">
      <span className="text-blue-400">Tyde</span> Home Fittings & Sanitary Wares 
    </h1>

    <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
      Premium home fittings and sanitary solutions for modern living
    </p>

    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      {/* Catalog Button */}
      <button className="bg-blue-800 hover:bg-blue-500 text-blue-300 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg">
        <FaShoppingCart /> Browse Catalog
      </button>

      {/* WhatsApp Order Button */}
      <a
  href="https://wa.me/254746623859?text=Hi, I would like to make an urgent order"
  target="_blank"
  rel="noopener noreferrer"
  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-2 transition-colors"
>
  <span 
    className="cursor-pointer bg-green-600 text-white border-4 border-green-700 shadow-lg hover:shadow-2xl hover:bg-green-500 hover:scale-105 transition-all duration-300 font-bold py-4 px-12 rounded-full text-xl flex items-center justify-center gap-3"
  >
    <FaWhatsapp className="text-2xl" />
    Make Urgent Order
  </span>
</a>


      {/* Phone Number Display */}
      <div className="bg-white border-4 border-blue-800 text-blue-900 font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        📞 Call Us: <a a="tel:+254746623859" className="underline hover:text-blue-700">0746 623 859</a>
      </div>
    </div>
  </div>
</section>


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
      {/* mp4 */}
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

{/* Home Inspiration Gallery */}
<section className="py-10 px-4 max-w-7xl mx-auto">
  <div className="text-center mb-10">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
      Home Inspiration Gallery
    </h2>
    <p className="text-gray-600 text-lg">
      Discover modern, elegant interior setups and ideas brought to life with our premium fittings.
    </p>
  </div>

  {/* Slideshow Carousel */}
  <h2 className="text-2xl font-bold text-gray-800 mb-2">
    Full-View Showroom Slides
  </h2>
  <p className="text-gray-600 mb-4">
    Get a closer look at our stunning installations — full-size views to ignite your home makeover vision.
  </p>

  <Slider {...settings} className="mb-10 rounded-xl overflow-hidden shadow-lg">
    {slideshowImages.map((url, i) => (
      <div key={i}>
        <img 
          src={url} 
          alt={`Slide ${i}`} 
          className="w-full h-[1000px] object-cover" 
        />
      </div>
    ))}
  </Slider>
  <br></br>
  <br></br>

  {/* Scrollable Image Teaser Row */}
  <h2 className="text-2xl font-bold text-gray-800 mb-2">
    Design Teasers at a Glance
  </h2>
  <p className="text-gray-600 mb-4">
    Swipe through sleek previews and get a feel of what your space could look like — elegance, one scroll at a time.
  </p>

  <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {slideshowImages.map((imgUrl, index) => (
      <div 
        key={index}
        className="flex-shrink-0 w-80 h-52 rounded-xl overflow-hidden shadow-md border border-gray-100 transform hover:scale-[1.03] transition duration-300 ease-in-out"
      >
        <img 
          src={imgUrl} 
          alt={`Gallery ${index + 1}`} 
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>

<br></br>
<br></br>
  {/* Video Showcase */}
  <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-2">
    See It in Motion
  </h2>
  <p className="text-gray-600 mb-4">
    Take a quick visual tour — see how our products blend effortlessly into real modern spaces.
  </p>

  <div className="mt-6">
    <video 
      autoPlay 
      muted 
      loop 
      playsInline 
      className="w-full h-[400px] rounded-xl object-cover shadow-md"
    >
      <source src="/homefittings.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  {/* Tagline */}
  <p className="text-2xl text-gray-800 font-semibold text-center mt-10 max-w-3xl mx-auto">
    🔍 A sneak peek into stunning interior designs and fittings. <br />
    <span className="text-blue-700 font-bold">Scroll down to explore full product categories 👇</span>
  </p>
</section>


      {/* Home Fittings Categories Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-blue-700">Home Fittings</span> & Sanitary Wares
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium quality home fittings and sanitary solutions for every need
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeCategories.map((category) => (
            <div 
              key={category.id}
              onClick={() => openCategoryModal(category)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200"
            >
              <div className="h-48 bg-blue-50 flex items-center justify-center">
                <div className="text-blue-700 group-hover:text-blue-900 transition-colors">
                  {category.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.items.length} products available</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    View Collection <FaArrowRight />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CategoryModal 
          category={selectedCategory} 
          onClose={setCategoryModalOpen} 
        />
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
          {/* Curated with timeless elegance


 */}
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
                  className="max-h-full max-w-full object-contain opacity-120 hover:opacity-70 transition-opacity"
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

            <a
  href={`https://wa.me/254746623859?text=Hi, I would like to request a quote!`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-2 transition-colors"
>
<span 
  className="cursor-pointer  bg-green-500 text-white border-4 border-green-700 shadow-lg hover:shadow-2xl hover:bg-green-600 hover:scale-105 transition-all duration-300 font-bold py-4 px-12 rounded-full text-xl flex items-center justify-center gap-3"
>
  <FaWhatsapp className="text-2xl " />
  Request Quote via WhatsApp
</span>
</a>
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