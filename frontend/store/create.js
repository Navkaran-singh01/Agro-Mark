import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCreateStore = create((set) => ({
  // State variables for UI feedback
  loading: false,
  error: null,
  createdProduct: null, // To store the product after creation

  // The action to create a product
  createProduct: async (formData) => {
    set({ loading: true, error: null }); // Set loading state and clear previous errors
    try {
      // Use .post() and set the correct header for file uploads
      const response = await axiosInstance.post('/createproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Product creation successful:", response.data);
      
      set({
        loading: false,
        createdProduct: response.data.product, // Store the newly created product
      });

      return response.data.product; // Return the product on success

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Product creation failed.";
      console.log("Error at product creation:", errorMessage);

      set({ 
        loading: false, 
        error: errorMessage 
      });

      return null; // Return null on failure
    }
  },
}));