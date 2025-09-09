import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { usefarmerStore } from '../store/farmer.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { products, loading, error, getAllProduct, searchProduct, placeOrder } = usefarmerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState({ message: '', visible: false, type: 'success' });

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      getAllProduct();
    } else {
      searchProduct({ searchTerm });
    }
  };

  const handleBuyClick = async (product) => {
    const result = await placeOrder(product._id);
    
    setOrderStatus({
      message: result.success ? `Successfully ordered ${product.name}!` : `Order failed: ${result.message}`,
      visible: true,
      type: result.success ? 'success' : 'error'
    });

    setTimeout(() => {
      setOrderStatus({ message: '', visible: false, type: 'success' });
    }, 3000);
  };

  const renderContent = () => {
    if (loading && products.length === 0) {
      return <p className="col-span-full text-center text-gray-500">Loading products...</p>;
    }

    if (error) {
      return <p className="col-span-full text-center text-red-500">Error: {error}</p>;
    }

    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No products found.</p>
          <p className="text-gray-500 mt-1">Try adjusting your search.</p>
        </div>
      );
    }

    return products.map((product) => (
      <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 flex flex-col">
        <img
          src={product.picture}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
        <Link
            to={`/farmerprofile?name=${encodeURIComponent(product.owner?.username || '')}`}
            className="text-xs font-medium text-white bg-green-500 px-2 py-1 rounded-full hover:bg-green-600 transition-colors cursor-pointer"
          >
            {product.owner?.username || 'Loading...'}
          </Link>          
          </div>
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
          <p className="text-2xl font-semibold text-green-600 mt-3">₹{product.price}</p>
          <div className="flex-grow"></div>
          <button
            onClick={() => handleBuyClick(product)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
            aria-label={`Buy ${product.name}`}
          >
            <ShoppingCart size={18} />
            Buy Now
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {orderStatus.visible && (
        <div className={`fixed top-24 right-5 px-6 py-3 rounded-lg shadow-xl text-white z-50 transition-opacity duration-300 ${orderStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {orderStatus.message}
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Farm Kart Logo" className="h-12 w-12 rounded-full mr-3" />
              <span className="text-2xl font-bold text-gray-800">FARM KART</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/order"
                className="px-5 py-2 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors"
              >
                Orders
              </Link>
              <a href="#" className="px-5 py-2 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition-colors">
                Account
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full h-64 md:h-80 lg:h-96">
        <img src="/main.png" alt="Fresh produce" className="w-full h-full object-cover" />
      </div>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Shop Product</h2>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button
                type="submit"
                className="p-2.5 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
