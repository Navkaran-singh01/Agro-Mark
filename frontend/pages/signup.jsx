import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.js";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        number: "",
        accountType: "Farmer",
        address: "",
    });

    const { signUp, loading, error } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // This will be the new user object or null
        const signedUpUser = await signUp(formData);

        if (signedUpUser) {
            // Use the returned user object to check account type
            if (signedUpUser.accountType === 'Farmer') {
                navigate("/farmerdashboard");
            } else {
                navigate("/dashboard");
            }
        }
        // If it fails, the error from the store will be displayed automatically.
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
            <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg">
                <div className="w-full">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">
                        Create Your Account
                    </h2>
                    <p className="text-sm text-gray-600 text-center mt-2 mb-6">
                        Join our community of farmers and food enthusiasts.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Account Type Dropdown */}
                        <div>
                            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                                Account Type
                            </label>
                            <select
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                            >
                                <option value="Farmer">Farmer</option>
                                <option value="Consumer">Consumer</option>
                            </select>
                        </div>

                        {/* --- Address Textarea (NEW) --- */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Address {formData.accountType === 'Farmer' && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required={formData.accountType === 'Farmer'} // <-- Conditional requirement
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="123 Farm Lane, Villagetown"
                                rows="3"
                            />
                            {formData.accountType !== 'Farmer' && (
                                <p className="text-xs text-gray-500 mt-1">Address is optional for consumers.</p>
                            )}
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="number"
                                name="number"
                                type="tel"
                                required
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="123-456-7890"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <p className="text-sm text-center text-red-600 font-medium">
                                {error}
                            </p>
                        )}

                        {/* Terms Checkbox */}
                        <div className="flex items-center text-sm text-gray-600">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="terms">
                                I agree to the{" "}
                                <span className="text-green-600 underline cursor-pointer">
                                    Terms & Conditions
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    {/* Link to Login Page */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-green-600 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

