import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // Make sure this file is correct!
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true, // Start true to show loading until the first auth check is done
    error: null,
    socket: null,

    checkAuth: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get('/checkAuth');
            set({ user: response.data.user, isAuthenticated: true, loading: false });
            console.log("Authentication check successful");
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
    },
    
    // Corrected socket connection logic
    connectSocket: () => {
        const { user } = get();
        // Only connect if a user exists and a socket isn't already connected
        if (!user || get().socket?.connected) return;
        
        const newSocket = io("http://localhost:5000");
        newSocket.connect();
        set({ socket: newSocket });
    },

    // Corrected socket disconnection logic
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}));
