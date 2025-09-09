import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { usefarmerStore } from "../store/farmer";

const FarmerProfile = () => {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('name') || 'Unknown Farmer';

    const { products, loading, error, getProductsByFarmerUsername } = usefarmerStore();

    useEffect(() => {
        if (username) getProductsByFarmerUsername(username);
    }, [username, getProductsByFarmerUsername]);

    const renderProducts = () => {
        if (loading) return <p className="text-center text-gray-500">Loading products for {username}...</p>;
        if (error) return <p className="text-center text-red-500">Error: {error}</p>;
        if (!products || products.length === 0) return (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">No products found for {username}.</p>
            </div>
        );

        return products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 flex flex-col">
                <img
                    src={product.picture}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                    <p className="text-2xl font-semibold text-green-600 mt-3">₹{product.price}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-8">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
                {/* Header Block */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
                        {username}
                    </h1>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Message
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {renderProducts()}
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors transform hover:scale-105"
                    >
                        Back to All Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;
