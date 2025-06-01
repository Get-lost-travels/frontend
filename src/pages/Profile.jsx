import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Add extra api call if needed mock a load for now
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <div class="min-h-screen bg-gray-100 flex justify-center items-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 class="text-2xl font-bold text-[#16325B] mb-4">Not Authenticated</h2>
          <p class="text-gray-700 mb-6">Please log in to view your profile.</p>
          <Link href="/login" class="inline-block bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div class="flex justify-center items-center h-screen">
        <div class="w-16 h-16 border-4 border-[#FFDC7F] border-t-[#16325B] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="min-h-screen py-8 w-4/5 mx-auto">
      <div class="container mx-auto px-4">
        {/* Profile Content */}
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div class="flex items-center space-x-6">
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-[#FFDC7F]">
                    <span class="text-[#16325B] text-center text-3xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div class="flex-grow">
                  <h2 class="text-2xl font-bold mb-1">{user?.username || 'User'}</h2>
                  <p class="text-blue-100">{user?.email || 'No email available'}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-semibold text-[#16325B] mb-4">Account Information</h3>
                  <div class="space-y-3">
                    <div>
                      <p class="text-gray-500 text-sm">Username</p>
                      <p class="font-medium">{user?.username || 'Not provided'}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">Email</p>
                      <p class="font-medium">{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">Account Type</p>
                      <p class="font-medium capitalize">{user?.role || 'Standard'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-[#16325B] mb-4">Quick Actions</h3>
                  <div class="space-y-2">
                    <Link href="/explore" class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Explore Travel Services
                    </Link>
                    <Link href="/bookings" class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      My Bookings
                    </Link>
                    <button 
                      onClick={logout}
                      class="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Footer */}
            <div class="border-t border-gray-200 p-6">
              <p class="text-gray-500 text-sm text-center">
                You can contact support at support@losttravels.com for any account-related assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 