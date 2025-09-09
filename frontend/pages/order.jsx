import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { usefarmerStore } from '../store/farmer.js'; // Adjust the import path as needed

const Order = () => {
    // 1. Connect to the store to get cart items and status
    // Note: The store should be updated to set `cartItems`, not `products`, in the `getCartItems` function.
    const { cartItems, loading, error, getCartItems } = usefarmerStore();

    // 2. Fetch the user's orders when the component mounts
    useEffect(() => {
        getCartItems();
    }, [getCartItems]);

    // 3. Helper function to render the main content based on the data fetching state
    const renderOrderContent = () => {
        // Show a loading message while fetching
        if (loading) {
            return <p className="text-center text-gray-500 mt-8">Loading your orders...</p>;
        }
    
        // Show an error message if something went wrong
        if (error) {
            return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
        }
    
        // Show a message if the user has no orders
        if (!cartItems || cartItems.length === 0) {
            return (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">You haven't ordered anything yet.</h3>
                    <p className="text-gray-500 mt-1">Products you buy will appear here.</p>
                </div>
            );
        }

        // Display the list of ordered items
        return (
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                        <img 
                            src={item.picture} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                        />
                        <div className="flex-grow">
                            <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-lg text-green-600">₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
             {/* Header section, styled like the dashboard */}
             <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center cursor-pointer">
                            <img src="/logo.png" alt="Farm Kart Logo" className="h-12 w-12 rounded-full mr-3" />
                            <span className="text-2xl font-bold text-gray-800">FARM KART</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            {/* Link to navigate back to the main shop page */}
                            <Link to="/" className="px-5 py-2 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors">
                                Home
                            </Link>
                            <a href="#" className="px-5 py-2 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors">
                                Account
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content area for displaying orders */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h2>
                    {renderOrderContent()}
                </div>
            </main>
        </div>
    );
};

export default Order;

