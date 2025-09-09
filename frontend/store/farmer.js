import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usefarmerStore = create((set) => ({
    // Initial State
    farmer: null,
    loading: false,
    error: null,
    products: [],
    cartItems: [],

    // Action to fetch logged-in farmer's information
    fetchFarmerInfo: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/getfarmer');
            set({ farmer: response.data.farmer, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch farmer information";
            set({ error: errorMessage, loading: false });
            console.error("Error fetching farmer info:", error);
        }
    },

    // Action to clear data on logout
    clearFarmer: () => {
        set({ farmer: null });
    },

    // NEW FUNCTION: Fetches products for the logged-in farmer
    getProductInfo: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/getProduct');
            set({ products: response.data.products, loading: false });
        } catch (error) {
            console.log('Error in fetching farmer products', error);
            const errorMessage = error.response?.data?.message || "Failed to fetch your products.";
            set({ error: errorMessage, loading: false });
        }
    },

    // Action to get all products for the main dashboard
    getAllProduct: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/getAllProducts');
            set({ products: response.data, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch products";
            set({ error: errorMessage, loading: false });
        }
    },

    // Action to search for products
    searchProduct: async (searchData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/searchProduct', searchData);
            set({ products: response.data, loading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to search for products";
            set({ error: errorMessage, loading: false });
        }
    },

    // Action to place an order for a single product
    placeOrder: async (productId) => {
        try {
            const response = await axiosInstance.post('/addproduct', { productId });
            return { success: true, message: response.data.message || "Order placed successfully!" };
        } catch (error) {
            console.error('Error placing order:', error);
            const message = error.response?.data?.message || "Could not place the order.";
            return { success: false, message };
        }
    },

    // Action to fetch the user's ordered items for the orders page
    getCartItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/cart');
            set({ cartItems: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching cart items:", error);
            const errorMessage = error.response?.data?.message || "Failed to fetch your orders.";
            set({ error: errorMessage, loading: false, cartItems: [] });
        }
    },

    // Action to get products by a specific farmer's username
    getProductsByFarmerUsername: async (username) => {
        set({ loading: true, error: null, products: [] });
        try {
            // Correctly pass the username as a query parameter
            const response = await axiosInstance.get(`/productbyfarmer`, { params: { username } });
            set({ products: response.data, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch farmer's products.";
            set({ error: errorMessage, loading: false });
            console.error("Error fetching farmer's products:", error);
        }
    }
}));
