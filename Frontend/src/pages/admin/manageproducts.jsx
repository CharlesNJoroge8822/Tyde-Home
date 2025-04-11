import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
  FiPackage, FiImage, FiDollarSign, FiShoppingCart, 
  FiEdit, FiTrash2, FiPlus, FiLoader, FiSearch,
  FiFilter, FiTag, FiArrowLeft, FiSave, FiX,
  FiUpload, FiImage as FiImages, FiAlertCircle,
  FiCheckCircle, FiAlertTriangle, FiInfo
} from 'react-icons/fi';

const MySwal = withReactContent(Swal);

// 


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    sku: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    in_stock: false
  });
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageSlideInterval, setImageSlideInterval] = useState({});

  // image upload success
  const showSuccessAlert = (message) => {
    MySwal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg'
      }
    });
  };

  // SVG data URL for fallback image
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlZWVlIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzY2NiI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';


// All Categories
  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.search) params.append('search', searchParams.search.toLowerCase());
      if (searchParams.category) params.append('category', searchParams.category);
      if (searchParams.min_price) params.append('min_price', searchParams.min_price);
      if (searchParams.max_price) params.append('max_price', searchParams.max_price);
      if (searchParams.in_stock) params.append('in_stock', 'true');

      const response = await fetch(`http://127.0.0.1:5000/products?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to load products');
      
      setProducts(data);
      // Initialize image indexes and slide intervals for each product
      const initialIndexes = {};
      const initialIntervals = {};
      data.forEach(product => {
        initialIndexes[product.id] = 0;
        initialIntervals[product.id] = null;
      });
      setCurrentImageIndex(initialIndexes);
      setImageSlideInterval(initialIntervals);
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/products/categories');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to load categories');
      
      setCategories(data);
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  // Helper function to get image URL
  const getImageUrl = (url) => {
    if (!url) return fallbackImage;
    return url.startsWith('http') ? url : `http://127.0.0.1:5000${url}`;
  };

  // Edit product - populate form
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsCreatingProduct(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku || '',
      category: product.category || ''
    });
  };

  // Reset form
  const handleCancelEdit = () => {
    setCurrentProduct(null);
    setIsCreatingProduct(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: 0,
      sku: '',
      category: ''
    });
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5000/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          sku: formData.sku,
          category: formData.category
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to update product');
      
      showSuccessAlert('Product updated successfully!');
      setCurrentProduct(data.product);
      fetchProducts();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:5000/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          sku: formData.sku,
          category: formData.category
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to create product');
      
      showSuccessAlert('Product created successfully!');
      setCurrentProduct(data.product);
      setIsCreatingProduct(false);
      fetchProducts();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      
      if (result.isConfirmed) {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/products/${productId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete product');
        }
        
        showSuccessAlert('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload images for a product
const handleUploadImages = async (productId, files) => {
  if (!files || files.length === 0) {
    showErrorAlert('Please select at least one image to upload');
    return;
  }

  setUploadingImages(true);
  
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append each file individually with the correct field name
    Array.from(files).forEach((file, index) => {
      formData.append('image_files', file);  // Note: field name should match what your backend expects
    });

    // Add any additional data if needed by your backend
    formData.append('product_id', productId);

    const response = await fetch(`http://127.0.0.1:5000/products/${productId}/images`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type header - let the browser set it with the boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload images');
    }

    const data = await response.json();
    showSuccessAlert(data.message || 'Images uploaded successfully!');
    // console.log(data.message || 'Images uploaded successfully!');
    fetchProducts();
  } catch (error) {
    showErrorAlert(error.message || 'An error occurred during upload');
    console.error('Upload error:', error);
  } finally {
    setUploadingImages(false);
  }
};

// Trigger file input for image upload
const triggerImageUpload = (productId) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.multiple = true;
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadImages(productId, e.target.files);
    }
  };
  fileInput.click();
};

  // Show error alert with SweetAlert
  const showErrorAlert = (message) => {
    MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg'
      }
    });
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: 'Out of stock',
        color: 'bg-red-100 text-red-800',
        icon: <FiAlertCircle className="text-red-500" />
      };
    } else if (stock < 10) {
      return {
        text: 'Very low stock',
        color: 'bg-red-100 text-red-800',
        icon: <FiAlertTriangle className="text-red-500" />
      };
    } else if (stock < 20) {
      return {
        text: 'Low stock',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <FiAlertTriangle className="text-yellow-500" />
      };
    } else {
      return {
        text: 'In stock',
        color: 'bg-green-100 text-green-800',
        icon: <FiCheckCircle className="text-green-500" />
      };
    }
  };

  // Start image slideshow for a product
  const startSlideshow = (productId, images) => {
    if (images.length <= 1) return;
    
    // Clear any existing interval
    if (imageSlideInterval[productId]) {
      clearInterval(imageSlideInterval[productId]);
    }
    
    // Set new interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [productId]: (prev[productId] + 1) % images.length
      }));
    }, 3000);
    
    setImageSlideInterval(prev => ({
      ...prev,
      [productId]: interval
    }));
  };

  // Stop image slideshow for a product
  const stopSlideshow = (productId) => {
    if (imageSlideInterval[productId]) {
      clearInterval(imageSlideInterval[productId]);
      setImageSlideInterval(prev => ({
        ...prev,
        [productId]: null
      }));
    }
  };

  // Handle next image
  const handleNextImage = (productId, images) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % images.length
    }));
  };

  // Handle previous image
  const handlePrevImage = (productId, images) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + images.length) % images.length
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center mb-8">
        <FiPackage className="text-3xl mr-3 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
          <FiFilter className="mr-2 text-indigo-500" />
          Filter Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FiSearch className="mr-2" /> Search
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.search}
              onChange={(e) => setSearchParams({...searchParams, search: e.target.value})}
              placeholder="Product name or description"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FiTag className="mr-2" /> Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.category}
              onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="">In Stock</option>
              <option value="">All Categories</option>
              <option value="">All Categories</option>
              <option value="">All Categories</option>
              <option value="">All Categories</option>
              <option value="">All Categories</option>

              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="in_stock"
              checked={searchParams.in_stock}
              onChange={(e) => setSearchParams({...searchParams, in_stock: e.target.checked})}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="in_stock" className="ml-2 text-sm font-medium text-gray-700">
              In Stock Only
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FiDollarSign className="mr-2" /> Min Price
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.min_price}
              onChange={(e) => setSearchParams({...searchParams, min_price: e.target.value})}
              placeholder="Minimum price"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FiDollarSign className="mr-2" /> Max Price
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.max_price}
              onChange={(e) => setSearchParams({...searchParams, max_price: e.target.value})}
              placeholder="Maximum price"
            />
          </div>
        </div>
      </div>

      {/* Product Form Section */}
      {(currentProduct || isCreatingProduct) && (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700">
            {isCreatingProduct ? (
              <>
                <FiPlus className="mr-2 text-indigo-500" />
                Create New Product
              </>
            ) : (
              <>
                <FiEdit className="mr-2 text-indigo-500" />
                Edit Product (ID: {currentProduct.id})
              </>
            )}
          </h2>
          <form onSubmit={isCreatingProduct ? handleCreateProduct : handleUpdateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Product Name*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Price*</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Description*</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">SKU (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Category (Optional)</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    {isCreatingProduct ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    {isCreatingProduct ? (
                      <>
                        <FiPlus className="mr-2" />
                        Create Product
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Update Product
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Products List Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiPackage className="mr-2 text-indigo-500" />
            Product List
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Showing {products.length} products
            </span>
            <button
              onClick={() => {
                setIsCreatingProduct(true);
                setCurrentProduct(null);
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  stock: 0,
                  sku: '',
                  category: ''
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
            >
              <FiPlus className="mr-2" /> Add Product
            </button>
          </div>
        </div>
        
        {loading && products.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-64">
            <FiLoader className="animate-spin text-3xl mb-4 text-indigo-500" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 h-64 flex items-center justify-center">
            <div>
              <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>No products found matching your criteria</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start space-x-6 mb-4 md:mb-0 w-full">
                    {/* Product Images */}
                    <div className="relative h-32 w-32 flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <div 
                          className="relative h-full w-full"
                          onMouseEnter={() => startSlideshow(product.id, product.images)}
                          onMouseLeave={() => stopSlideshow(product.id)}
                        >
                          <img 
                            src={getImageUrl(product.images[currentImageIndex[product.id] || 0].image_url)}
                            alt={product.name}
                            className="h-full w-full object-contain border rounded-lg"
                            onError={(e) => {
                              if (e.target.src !== fallbackImage) {
                                e.target.src = fallbackImage;
                                e.target.className = 'h-full w-full object-contain border rounded-lg bg-gray-100';
                              }
                            }}
                          />
                          {product.images.length > 1 && (
                            <>
                              <button 
                                onClick={() => handlePrevImage(product.id, product.images)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                              >
                                <FiArrowLeft size={16} />
                              </button>
                              <button 
                                onClick={() => handleNextImage(product.id, product.images)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                              >
                                <FiArrowLeft size={16} className="transform rotate-180" />
                              </button>
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                                {product.images.map((_, idx) => (
                                  <div 
                                    key={idx}
                                    className={`h-1 w-1 rounded-full ${idx === currentImageIndex[product.id] ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="h-full w-full border rounded-lg bg-gray-100 flex items-center justify-center">
                          <FiImage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {product.name}
                        {product.category && (
                          <span className="ml-3 text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1 flex items-center">
                        <FiDollarSign className="mr-1" /> 
                        {product.price?.toFixed(2)}
                      </p>
                      <div className="mt-1 flex items-center space-x-3">
                        <span className={`text-sm px-2 py-1 rounded-full ${getStockStatus(product.stock).color} flex items-center`}>
                          {getStockStatus(product.stock).icon}
                          <span className="ml-1">{getStockStatus(product.stock).text}</span>
                        </span>
                        {product.images && product.images.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full flex items-center">
                            <FiImages className="mr-1" />
                            {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => triggerImageUpload(product.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                      title="Add images"
                      disabled={uploadingImages}
                    >
                      {uploadingImages ? (
                        <FiLoader className="animate-spin mr-2" />
                      ) : (
                        <FiUpload className="mr-2" />
                      )}
                      Images
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm flex items-center"
                      title="Edit product"
                    >
                      <FiEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center"
                      title="Delete product"
                    >
                      <FiTrash2 className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
                
                {/* Additional Images Display */}
                {product.images && product.images.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <FiImages className="mr-2" />
                      Product Images ({product.images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {product.images.map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={getImageUrl(image.image_url)}
                            alt={`${product.name} - ${idx + 1}`}
                            className="h-32 w-full object-cover border rounded-lg"
                            onError={(e) => {
                              if (e.target.src !== fallbackImage) {
                                e.target.src = fallbackImage;
                                e.target.className = 'h-32 w-full object-cover border rounded-lg bg-gray-100';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button 
                              className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100"
                              onClick={() => setCurrentImageIndex({...currentImageIndex, [product.id]: idx})}
                            >
                              <FiInfo className="text-gray-800" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;