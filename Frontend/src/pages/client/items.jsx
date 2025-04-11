import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX, 
  FiExternalLink,
  FiClock,
  FiTag,
  FiStar,
  FiCheck,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiPhone,
  FiInfo,
  FiCalendar
} from 'react-icons/fi';

const Items = () => {
  const [products, setProducts] = useState([]);
  const [gridAds, setGridAds] = useState([]);
  const [modalAds, setModalAds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Fallback image in SVG format
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlZWVlIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzY2NiI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('http://127.0.0.1:5000/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        
        // Fetch ads for grid
        const gridAdsResponse = await fetch('http://127.0.0.1:5000/ads/random?limit=3');
        if (!gridAdsResponse.ok) throw new Error('Failed to fetch grid ads');
        const gridAdsData = await gridAdsResponse.json();
        
        setProducts(productsData);
        setGridAds(gridAdsData);
      } catch (error) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch fresh modal ads when product is selected
  const handleProductClick = async (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCurrentImageIndex(0);
    setImageLoading(true);
    setOrderCreated(false);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/ads/random?limit=2');
      if (!response.ok) throw new Error('Failed to fetch modal ads');
      const data = await response.json();
      setModalAds(data);
    } catch (error) {
      console.error('Error fetching modal ads:', error);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
    setOrderCreated(false);
    setShowPaymentModal(false);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (selectedProduct?.stock || 10)) {
      setQuantity(value);
    }
  };

  // Handle image navigation
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % (selectedProduct?.images?.length || 1)
    );
    setImageLoading(true);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + (selectedProduct?.images?.length || 1)) % (selectedProduct?.images?.length || 1)
    );
    setImageLoading(true);
  };

  const handleBuyNow = async () => {
    try {
      // Validate quantity is positive number
      if (quantity <= 0 || isNaN(quantity)) {
        throw new Error('Please enter a valid quantity');
      }
  
      // Validate product is selected and has stock
      if (!selectedProduct || selectedProduct.stock < quantity) {
        throw new Error('Not enough stock available');
      }
  
      const requestBody = {
        items: [{
          product_id: Number(selectedProduct.id), // Ensure number type
          quantity: Number(quantity) // Ensure number type
        }]
      };
      
      console.log("Sending order request:", requestBody);
  
      // Verify token exists
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to place an order');
      }
  
      const response = await fetch('http://127.0.0.1:5000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
  
      const responseData = await response.json(); // Always parse JSON first
      
      if (!response.ok) {
        console.error("Backend error details:", responseData);
        throw new Error(responseData.message || `Order failed: ${response.statusText}`);
      }  
  
      // Success case
      setOrderDetails(responseData);
      setOrderCreated(true);
      setShowPaymentModal(true);
  
      // Update local stock
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === selectedProduct.id 
            ? { ...product, stock: product.stock - quantity } 
            : product
        )
      );
  
      toast.success('Order created successfully! Please complete your payment.');
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || 'Failed to create order');
    }
  };
  
  // Get related products
  const relatedProducts = selectedProduct 
    ? products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 4)
    : [];

  // Strategically place ads among products
  const getDisplayItems = () => {
    if (products.length === 0) return [];
    
    const displayItems = [...products];
    const adPositions = [2, 6, 10]; // Positions where ads will appear
    
    gridAds.forEach((ad, index) => {
      if (adPositions[index] < displayItems.length) {
        displayItems.splice(adPositions[index] + index, 0, {
          ...ad,
          isAd: true
        });
      }
    });
    
    return displayItems;
  };

  // Get image URL with fallback
  const getImageUrl = (url) => {
    if (!url) return fallbackImage;
    return url.startsWith('http') ? url : `http://127.0.0.1:5000${url}`;
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: 'Out of Stock',
        color: 'bg-red-100 text-red-800',
        icon: 'text-red-500'
      };
    } else if (stock < 10) {
      return {
        text: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800',
        icon: 'text-yellow-500'
      };
    } else {
      return {
        text: 'In Stock',
        color: 'bg-green-100 text-green-800',
        icon: 'text-green-500'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Products Grid with Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {getDisplayItems().map((item) => (
            item.isAd ? (
              // Ad Card - Gradient Theme
              <div 
                key={`ad-${item.id}`}
                className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl shadow-sm overflow-hidden border border-teal-100 hover:shadow-md transition-all duration-300 group relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_url || fallbackImage}
                    alt={item.title || 'Advertisement'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      if (e.target.src !== fallbackImage) {
                        e.target.src = fallbackImage;
                        e.target.className = 'w-full h-full object-cover bg-gray-100';
                      }
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sponsored</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <FiTag className="w-4 h-4 text-teal-500 mr-1" />
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{item.title || 'Special Offer'}</h3>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description || 'Check out this amazing deal!'}</p>
                  <button 
                    className="w-full py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white text-xs font-semibold rounded-md transition-all flex items-center justify-center space-x-1 shadow-md hover:shadow-lg"
                    onClick={() => window.open(item.link || '#', '_blank')}
                  >
                    <span>View Offer</span>
                    <FiExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
                  <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
              </div>
            ) : (
              // Product Card
              <div 
                key={item.id} 
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-gray-100 relative"
                onClick={() => handleProductClick(item)}
                onMouseEnter={() => setIsHovering(item.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                {item.discount && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                    {item.discount}% OFF
                  </div>
                )}

                <div className="relative h-64 overflow-hidden">
                  {item.images?.length > 0 ? (
                    <img
                      src={getImageUrl(item.images[0].image_url)}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isHovering === item.id ? 'scale-105' : 'scale-100'}`}
                      onError={(e) => {
                        if (e.target.src !== fallbackImage) {
                          e.target.src = fallbackImage;
                          e.target.className = 'w-full h-full object-cover bg-gray-100';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <img src={fallbackImage} alt="No image available" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full shadow-sm ${getStockStatus(item.stock).color}`}>
                        {getStockStatus(item.stock).text}
                      </span>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                        ${item.price.toFixed(2)}
                        {item.original_price && (
                          <span className="ml-1 text-xs line-through opacity-75">${item.original_price.toFixed(2)}</span>
                        )}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                      <button 
                        className="px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(item);
                        }}
                      >
                        <FiShoppingCart className="mr-2" />
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FiHeart className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">(24)</span>
                    </div>
                    {item.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Product Detail Modal with Ads */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-6 right-6 bg-white text-gray-800 rounded-full p-2 z-10 hover:bg-gray-100 transition-colors shadow-md hover:scale-105 transform transition-transform"
                >
                  <FiX className="w-5 h-5" />
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Left Column - Product Images and Ads */}
                  <div className="space-y-8">
                    {/* Main Product Image */}
                    <div className="relative h-96 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                      {selectedProduct.images?.length > 0 ? (
                        <>
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                          )}
                          <img
                            src={getImageUrl(selectedProduct.images[currentImageIndex].image_url)}
                            alt={selectedProduct.name}
                            className={`max-h-full max-w-full object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                            onLoad={() => setImageLoading(false)}
                            onError={(e) => {
                              if (e.target.src !== fallbackImage) {
                                e.target.src = fallbackImage;
                                e.target.className = 'max-h-full max-w-full object-contain bg-gray-100';
                                setImageLoading(false);
                              }
                            }}
                          />
                        </>
                      ) : (
                        <img src={fallbackImage} alt="No image available" className="w-full h-full object-contain" />
                      )}
                      
                      {selectedProduct.images?.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all hover:scale-110 transform"
                          >
                            <FiChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all hover:scale-110 transform"
                          >
                            <FiChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {selectedProduct.images?.length > 1 && (
                      <div className="flex space-x-3 overflow-x-auto py-2 px-1 -mx-1">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex ? 'border-indigo-600 scale-105' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                              setImageLoading(true);
                            }}
                          >
                            <img
                              src={getImageUrl(image.image_url)}
                              alt={`${selectedProduct.name} thumbnail ${index}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                if (e.target.src !== fallbackImage) {
                                  e.target.src = fallbackImage;
                                  e.target.className = 'w-full h-full object-cover bg-gray-100';
                                }
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Modal Ads - Gradient Theme */}
                    {modalAds.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                          <FiClock className="mr-2 text-purple-500" />
                          Limited Time Offers
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {modalAds.map((ad) => (
                            <div 
                              key={`modal-ad-${ad.id}`}
                              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100 hover:shadow-md transition-all group"
                            >
                              <div className="relative h-24 overflow-hidden rounded-md mb-2">
                                <img
                                  src={ad.image_url || fallbackImage}
                                  alt={ad.title || 'Advertisement'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    if (e.target.src !== fallbackImage) {
                                      e.target.src = fallbackImage;
                                      e.target.className = 'w-full h-full object-cover bg-gray-100';
                                    }
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600/90 text-center py-0.5">
                                  <span className="text-xs font-bold text-white uppercase tracking-wider">Sponsored</span>
                                </div>
                              </div>
                              <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{ad.title || 'Special Offer'}</h5>
                              <button 
                                className="mt-1 w-full py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-medium rounded transition-all flex items-center justify-center space-x-1"
                                onClick={() => window.open(ad.link || '#', '_blank')}
                              >
                                <span>View Offer</span>
                                <FiExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Product Details */}
                  <div className="pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-3xl font-semibold text-gray-900 mb-1">{selectedProduct.name}</h2>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-xs text-gray-600">4.8 (24 reviews)</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStockStatus(selectedProduct.stock).color}`}>
                            {getStockStatus(selectedProduct.stock).text}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedProduct.original_price && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            ${selectedProduct.original_price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-semibold text-indigo-600">
                          ${selectedProduct.price.toFixed(2)}
                        </span>
                        {selectedProduct.discount && (
                          <span className="block text-xs text-green-600 mt-1">
                            Save {selectedProduct.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Highlights */}
                    <div className="mb-6 border-b pb-6">
                      <h3 className="font-semibold text-gray-700 mb-3 text-lg">Highlights</h3>
                      <ul className="space-y-2">
                        {selectedProduct.description.split('. ').filter(Boolean).map((point, i) => (
                          <li key={i} className="flex items-start">
                            <FiCheck className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{point}.</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Shipping and Warranty Info */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiTruck className="w-5 h-5 text-indigo-500 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Delivery</p>
                          <p className="text-sm font-medium">Free shipping</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiShield className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Warranty</p>
                          <p className="text-sm font-medium">1 year</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity and Add to Cart */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <label htmlFor="quantity" className="mr-3 font-medium text-gray-700">Quantity:</label>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button 
                            className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={selectedProduct.stock}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-16 p-2 text-center border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button 
                            className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            onClick={() => setQuantity(prev => Math.min(selectedProduct.stock, prev + 1))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <span className="text-xl font-semibold text-indigo-600">
                          ${(selectedProduct.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => {
                          toast.info('Please login to add items to cart');
                          closeModal();
                        }}
                        className={`px-6 py-3 bg-indigo-600 text-white rounded-lg flex-1 transition-all duration-300 flex items-center justify-center space-x-2 ${
                          selectedProduct.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-md'
                        }`}
                        disabled={selectedProduct.stock <= 0}
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        onClick={handleBuyNow}
                        className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex-1 transition-all duration-300 shadow-md flex items-center justify-center space-x-2 ${
                          selectedProduct.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-lg'
                        }`}
                        disabled={selectedProduct.stock <= 0}
                      >
                        <span>Buy Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Secondary Ad Space - Gradient Theme */}
                    {modalAds.length > 0 && (
                      <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-gradient-to-br from-amber-100 to-orange-100 p-2 rounded-full mr-3">
                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-amber-800 mb-1">Exclusive Deals</h4>
                            <p className="text-xs text-amber-700">Don't miss these limited-time offers!</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {modalAds.map((ad) => (
                                <button
                                  key={`inline-ad-${ad.id}`}
                                  onClick={() => window.open(ad.link || '#', '_blank')}
                                  className="text-xs font-medium text-amber-700 hover:text-amber-900 underline flex items-center"
                                >
                                  {ad.title || 'Special Offer'}
                                  <FiExternalLink className="ml-1 w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                  <div className="border-t p-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6">You May Also Like</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(product => (
                          <div 
                            key={product.id} 
                            className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-100 group relative"
                            onClick={() => {
                              setSelectedProduct(product);
                              setCurrentImageIndex(0);
                              setImageLoading(true);
                              setOrderCreated(false);
                            }}
                          >
                            {product.discount && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                                {product.discount}% OFF
                              </div>
                            )}
                            <div className="relative h-40 overflow-hidden rounded-lg mb-3">
                              {product.images?.length > 0 ? (
                                <img
                                  src={getImageUrl(product.images[0].image_url)}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  onError={(e) => {
                                    if (e.target.src !== fallbackImage) {
                                      e.target.src = fallbackImage;
                                      e.target.className = 'w-full h-full object-cover bg-gray-100';
                                    }
                                  }}
                                />
                              ) : (
                                <img src={fallbackImage} alt="No image available" className="w-full h-full object-contain" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-indigo-600 font-semibold">${product.price.toFixed(2)}</p>
                              {product.original_price && (
                                <p className="text-xs text-gray-500 line-through">${product.original_price.toFixed(2)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Instructions Modal */}
        {showPaymentModal && orderDetails && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCheck className="text-green-500 mr-2" />
                    Order #{orderDetails.order.id} Created Successfully!
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">{quantity} x {selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-indigo-600">${orderDetails.order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Status:</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Processing
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="flex items-center text-gray-700">
                        <FiCalendar className="mr-1" />
                        {new Date(orderDetails.order.estimated_delivery).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCreditCard className="text-indigo-500 mr-2" />
                    Payment Instructions
                  </h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <FiInfo className="mr-2" />
                      Important Note
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your order will remain in "Processing" status until payment is confirmed. 
                      Delivery will be initiated within 24 hours of payment confirmation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                        <FiPhone className="mr-2" />
                        M-Pesa Payment
                      </h4>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 pl-2">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select <span className="font-medium">Lipa na M-Pesa</span></li>
                        <li>Select <span className="font-medium">Pay Bill</span></li>
                        <li>Enter Business Number: <span className="font-bold">123456</span></li>
                        <li>Enter Account Number: <span className="font-bold">ORDER{orderDetails.order.id}</span></li>
                        <li>Enter Amount: <span className="font-bold">{orderDetails.order.total_amount.toFixed(2)}</span></li>
                        <li>Enter your M-Pesa PIN and confirm</li>
                      </ol>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">Delivery Information</h4>
                      <p className="text-sm text-gray-600">
                        Your order will be delivered within 3 business days to your specified address. 
                        You will receive an SMS with tracking information once your order is shipped.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                  >
                    I Understand, Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;