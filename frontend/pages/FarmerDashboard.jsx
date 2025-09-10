import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCreateStore } from '../store/create.js';
import { usefarmerStore } from '../store/farmer.js';
import { UploadCloud, X, Plus } from 'lucide-react';

const FarmerDashboard = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // State and actions from your stores
    const { createProduct, loading: createLoading, error: createError } = useCreateStore();
    const { products, loading: productsLoading, getProductInfo } = usefarmerStore();

    // Form state for the modal
    const [name, setName] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [preview, setPreview] = React.useState('');

    // Fetch products when the component mounts
    useEffect(() => {
        getProductInfo();
    }, [getProductInfo]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select an image for the product.");
            return;
        }

        const productData = new FormData();
        productData.append('name', name);
        productData.append('category', category);
        productData.append('description', description);
        productData.append('price', price);
        productData.append('postFile', file);

        const success = await createProduct(productData);
        if (success) {
            alert('Product uploaded successfully!');
            setIsModalOpen(false);
            // Reset form fields
            setName('');
            setCategory('');
            setDescription('');
            setPrice('');
            setFile(null);
            setPreview('');
            getProductInfo(); // Re-fetch products to show the new one
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* TOP HEADER */}
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Farm Kart Logo" className="h-12 w-12 rounded-full mr-3" />
                    <span className="text-2xl font-bold text-gray-800">FARM KART</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <Link
                    to="/farmeraccount"
                    className="px-5 py-2 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors"
                    >
                    Account
                    </Link>

                    {/* ✅ New Messages Button */}
                 <Link
                    to="/conversations"
                    className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                    >
                    Messages
                    </Link>
                </div>
                </div>
            </div>
            </header>

            {/* HERO IMAGE SECTION */}
            <div className="w-full h-64 md:h-80 lg:h-96">
                <img src="/main.png" alt="Fresh produce" className="w-full h-full object-cover" />
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* PRODUCTS BLOCK */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-3xl font-bold text-gray-800">Your Products</h2>
                         <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
                            aria-label="Upload New Product"
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    </div>

                    {/* DYNAMIC PRODUCT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {productsLoading ? (
                            <p className="text-gray-500 col-span-full text-center">Loading your products...</p>
                        ) : products.length === 0 ? (
                            <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg">
                                <p className="text-lg text-gray-600">You haven't added any products yet.</p>
                                <p className="text-gray-500 mt-1">Click the 'Add Product' button to get started!</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                    <img
                                        src={product.picture}
                                        alt={product.name}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize mt-1">{product.category}</p>
                                        <p className="text-2xl font-semibold text-green-600 mt-3">₹{product.price}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL FOR ADDING A NEW PRODUCT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Add a New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Form fields are unchanged */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input type="text" name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" name="price" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" step="0.01" min="0"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {preview ? (
                                            <img src={preview} alt="Product preview" className="mx-auto h-48 w-auto rounded-lg object-cover shadow-sm" />
                                        ) : (
                                            <>
                                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                                            </>
                                        )}
                                        <div className="flex text-sm text-gray-600 justify-center mt-2">
                                            <label htmlFor="postFile" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                                <span>{file ? "Change file" : "Select a file"}</span>
                                                <input id="postFile" name="postFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {createError && <p className="text-sm text-center text-red-600 font-medium bg-red-100 p-2 rounded-md">{createError}</p>}
                            <div className="flex justify-end pt-4 space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                <button type="submit" disabled={createLoading} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center">
                                    {createLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                                    {createLoading ? 'Uploading...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;