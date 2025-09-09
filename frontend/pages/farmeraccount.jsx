import React, { useEffect } from 'react';
import { usefarmerStore } from '../store/farmer'; // Make sure this path is correct

const FarmerAccount = () => {
  // 1. Destructure the correct action: fetchFarmerInfo
  const { farmer, loading, error, fetchFarmerInfo } = usefarmerStore();

  // 2. Call the new action when the component mounts
  useEffect(() => {
    fetchFarmerInfo();
  }, [fetchFarmerInfo]); // 3. Update the dependency array

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* 4. Updated loading text for clarity */}
        <div className="text-xl font-semibold">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-600 bg-red-100 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  // The rest of your JSX remains the same as it correctly displays the farmer's data
  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center p-4">
      {farmer ? (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 border-b pb-4">
            My Account
          </h1>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Username</span>
              <p className="text-lg text-gray-800">{farmer.username}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-lg text-gray-800">{farmer.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone Number</span>
              <p className="text-lg text-gray-800">{farmer.phone}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Address</span>
              <p className="text-lg text-gray-800">{farmer.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">No user details found. Please log in.</div>
      )}
    </div>
  );
};

export default FarmerAccount;