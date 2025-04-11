import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Define API URL
const API_URL = "http://localhost:5000"; 

// Create Context
const CrudContext = createContext();

// Context Provider
export const CrudProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [products, setProducts] = useState([]);


  // ---- Profiles CRUD Operations ----

  
  // Get all profiles
  const getProfiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles`);
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Create a new profile
  const createProfile = async (profileData) => {
    try {
      await axios.post(`${API_URL}/profile`, profileData);
      getProfiles(); // Refresh profiles after creating
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  // Update an existing profile
  const updateProfile = async (profileId, profileData) => {
    try {
      await axios.patch(`${API_URL}/profile/${profileId}`, profileData);
      getProfiles(); // Refresh profiles after updating
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Delete a profile
  const deleteProfile = async (profileId) => {
    try {
      await axios.delete(`${API_URL}/profile/${profileId}`);
      getProfiles(); // Refresh profiles after deletion
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  // ---- Products CRUD Operations ----

  // Get all products
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Create a new product
  const createProduct = async (productData) => {
    try {
      await axios.post(`${API_URL}/products`, productData);
      getProducts(); // Refresh products after creating
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update an existing product
  const updateProduct = async (productId, productData) => {
    try {
      await axios.patch(`${API_URL}/products/${productId}`, productData);
      getProducts(); // Refresh products after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      getProducts(); // Refresh products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <CrudContext.Provider
      value={{
        profiles,
        products,
        getProfiles,
        createProfile,
        updateProfile,
        deleteProfile,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </CrudContext.Provider>
  );
};

// Custom Hook to use the CrudContext
export const useCrud = () => useContext(CrudContext);
