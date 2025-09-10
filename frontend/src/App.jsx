import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.js";
import SignupPage from "../pages/signup.jsx";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/Dashboard.jsx"; // Consumer Dashboard
import FarmerDashboard from "../pages/FarmerDashboard"; // Farmer Dashboard
import FarmerAccount from "../pages/farmeraccount.jsx";
import Order from "../pages/order.jsx";
import Farmerprofile from "../pages/farmerprofile.jsx";
import Chat from "../pages/chat.jsx";
import Conversations from "../pages/Conversations.jsx";
const AuthenticatedRedirect = () => {
    const { user } = useAuthStore();
    if (!user) return <Login />; // Or a loading spinner
    return user.accountType === 'Farmer' ? <FarmerDashboard /> : <Dashboard />;
};
function App() {
    // Get the user object as well
    const { isAuthenticated, checkAuth, loading, user } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]); // Dependency array is correct
    if (loading) {
        // A better loading state for the initial check
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold">Loading Application...</div>
            </div>
        );
    }
    return (
        <div>
             {console.log("Auth Debug:", { isAuthenticated, user })};
            <Routes>
                {/* --- Public Routes --- */}
                {/* If authenticated, redirect from login/signup to the correct dashboard */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
                />
                {/* --- Protected Routes --- */}
                <Route
                    path="/"
                    element={isAuthenticated ? <AuthenticatedRedirect /> : <Login />}
                />
                <Route
                    path="/dashboard"
                    element={isAuthenticated && user?.accountType === 'Consumer' ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/farmerdashboard"
                    element={isAuthenticated && user?.accountType === 'Farmer' ? <FarmerDashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/farmeraccount" element={isAuthenticated && user.accountType==='Farmer'? <FarmerAccount></FarmerAccount>:<Navigate to="/login"></Navigate>}
                ></Route>
                {/* Optional: A catch-all route for any other path */}
                <Route path="/order" element={isAuthenticated && user.accountType==='Consumer'? <Order></Order>:<Navigate to="/login"></Navigate>}></Route>
                <Route path="/farmerprofile" element={isAuthenticated&& user.accountType==='Consumer' ? <Farmerprofile></Farmerprofile>:<Navigate to="/login"></Navigate>}></Route>
                <Route path="/conversations" element={isAuthenticated ? <Conversations></Conversations>:<Navigate to="/login"></Navigate>}></Route>
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}
export default App;

