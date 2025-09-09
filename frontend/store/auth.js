import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // Make sure this file is correct!

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true, // Start true to show loading until the first auth check is done
    error: null,

    checkAuth: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get('/checkAuth');
            set({ user: response.data.user, isAuthenticated: true, loading: false });
            console.log("Authentication check successful");
        } catch (error) {
            console.error("check Auth error");
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    signUp: async (formData) => {
        set({ loading: true, error: null });
        try {
            const endpoint = formData.accountType === 'Farmer' ? '/farmersignup' : '/signup';
            const response = await axiosInstance.post(endpoint, formData);
            console.log("signup success", response.data);

            set({
                user: response.data.user,
                isAuthenticated: true,
                loading: false
            });
            // Return the user object on success
            return response.data.user;
        } catch (error) {
            console.log("Signup error", error.response?.data?.message || error.message);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            set({ error: errorMessage, loading: false });
            // Return null on failure
            return null;
        }
    },

    login: async (formData) => {
        set({ loading: true, error: null });
        try {
            const endpoint = formData.accountType === 'Farmer' ? '/farmerlogin' : '/login';
            const response = await axiosInstance.post(endpoint, formData);
            console.log('login successful', response.data);
            set({
                user: response.data.user,
                isAuthenticated: true,
                loading: false,
            });
            // Return the user object on success
            return response.data.user;
        } catch (error) {
            console.log("login error", error.response?.data?.message || error.message);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            set({ error: errorMessage, loading: false });
            // Return null on failure
            return null;
        }
    }
}));
