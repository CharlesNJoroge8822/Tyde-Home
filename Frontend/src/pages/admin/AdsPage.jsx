import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiImage, FiEdit2, FiTrash2, FiX, FiExternalLink, FiUpload, FiCalendar } from 'react-icons/fi';

const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_id: '',
    image_url: '',
    position: 'homepage_banner',
    is_active: true,
    start_date: '',
    end_date: ''
  });
  const [editingAd, setEditingAd] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch ads from API
  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://tyde-home.onrender.com/ads/admin');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch ads');
      setAds(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? value === 'true' : value
    }));
  };

  // Handle image URL change
  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, image_url: value }));
    
    // Show preview if it's a valid URL
    if (value.match(/\.(jpeg|jpg|gif|png|webp)$/) || value.startsWith('data:image')) {
      setImagePreview(value);
    } else {
      setImagePreview(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, image_url: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to convert base64 to Blob
  const dataURLtoBlob = (dataurl) => {
    try {
      // Split the data URL to get the base64 part
      const arr = dataurl.split(',');
      if (arr.length < 2) {
        throw new Error('Invalid data URL format');
      }
      
      // Extract mime type
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
        throw new Error('Invalid mime type in data URL');
      }
      
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error('Error converting data URL to Blob:', error);
      toast.error('Invalid image format. Please upload a valid image.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!formData.title || !formData.product_id || !formData.image_url) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const url = editingAd 
        ? `https://tyde-home.onrender.com/ads/${editingAd.id}`
        : 'https://tyde-home.onrender.com/ads/';
      
      const method = editingAd ? 'PUT' : 'POST';
      
      // Prepare the data to send - ensure proper types
      const processedData = {
        title: formData.title,
        description: formData.description,
        product_id: Number(formData.product_id),
        position: formData.position,
        is_active: formData.is_active,
        start_date: formData.start_date || new Date().toISOString().split('T')[0],
        end_date: formData.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      let requestData;
      const headers = {};

      if (formData.image_url.startsWith('data:image')) {
        // Handle base64 image upload via FormData
        const blob = dataURLtoBlob(formData.image_url);
        if (!blob) {
          setIsSubmitting(false);
          return;
        }
        
        const formDataObj = new FormData();
        Object.keys(processedData).forEach(key => {
          formDataObj.append(key, processedData[key]);
        });
        
        formDataObj.append('image_file', blob, 'ad_image.jpg');
        requestData = formDataObj;
      } else {
        // Regular JSON request for URL-based images
        headers['Content-Type'] = 'application/json';
        requestData = JSON.stringify({
          ...processedData,
          image_url: formData.image_url
        });
      }

      const response = await fetch(url, {
        method,
        headers,
        body: requestData
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save ad');

      toast.success(`Ad ${editingAd ? 'updated' : 'created'} successfully`);
      closeModal();
      fetchAds();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred while saving the ad');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an ad with confirmation toast
  const deleteAd = async (adId) => {
    toast.dismiss(); // Dismiss any existing toasts
    
    const result = await new Promise((resolve) => {
      toast(
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-3">Are you sure you want to delete this ad?</h3>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false
        }
      );
    });

    if (!result) return;

    try {
      const response = await fetch(`https://tyde-home.onrender.com/ads/${adId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete ad');
      }

      toast.success('Ad deleted successfully');
      fetchAds();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Set form for editing
  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      product_id: ad.product_id,
      image_url: ad.image_url,
      position: ad.position,
      is_active: ad.is_active,
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : ''
    });
    setImagePreview(ad.image_url);
    setShowModal(true);
  };

  // Reset form and close modal
  const closeModal = () => {
    setFormData({
      title: '',
      description: '',
      product_id: '',
      image_url: '',
      position: 'homepage_banner',
      is_active: true,
      start_date: '',
      end_date: ''
    });
    setEditingAd(null);
    setImagePreview(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Advertisement Management</h1>
          <p className="text-gray-600">Manage your promotional banners and ads</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap"
        >
          <FiPlus className="mr-2" />
          Create New Ad
        </button>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Summer Sale Banner"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="123"
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="homepage_banner">Homepage Banner</option>
                    <option value="product_sidebar">Product Sidebar</option>
                    <option value="checkout_footer">Checkout Footer</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiCalendar size={14} /> Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiCalendar size={14} /> End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="mb-6 space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter ad description (optional)"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-6 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Image <span className="text-red-500">*</span>
                </label>
                
                {imagePreview && (
                  <div className="mb-4 flex justify-center">
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-40 rounded-lg border border-gray-200 object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                          Preview
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <FiImage className="mr-2 text-gray-500" />
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleImageChange}
                      placeholder="Enter image URL"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="block w-full p-3 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <FiUpload className="text-blue-600" />
                      <span className="text-blue-600 font-medium">Upload an image file</span>
                      <span className="text-xs text-gray-500">JPEG, PNG, GIF, WEBP (Max 5MB)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-24"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : editingAd ? (
                    'Update Ad'
                  ) : (
                    'Create Ad'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiImage size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No ads found</h3>
            <p className="text-gray-500 mb-4">Create your first advertisement to get started</p>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Ad
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-16 w-24 flex items-center justify-center bg-gray-100 rounded overflow-hidden shadow-sm">
                        {ad.image_url ? (
                          <img 
                            src={ad.image_url} 
                            alt={ad.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiImage className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{ad.title}</div>
                      <div className="text-gray-500 text-sm line-clamp-2">{ad.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/products/${ad.product_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center group"
                      >
                        #{ad.product_id}
                        <FiExternalLink className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 capitalize">{ad.position.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ad.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{ad.click_count}</span>
                          <span className="text-gray-500 text-xs">clicks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{ad.impression_count}</span>
                          <span className="text-gray-500 text-xs">views</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} className="text-gray-400" />
                          <span>{ad.start_date ? new Date(ad.start_date).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} className="text-gray-400" />
                          <span>{ad.end_date ? new Date(ad.end_date).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleEdit(ad)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteAd(ad.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsPage;