import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../api/bookings';
import BookingCard from '../components/BookingCard';

const Bookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [retries, setRetries] = useState(0);
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const response = await getMyBookings();
        setBookings(response.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        const errorMessage = 
          err.response?.status === 401 ? 'Authentication error. Please log in again.' :
          err.response?.status === 403 ? 'You do not have permission to view these bookings.' :
          err.message?.includes('Network Error') ? 'No bookings made yet. Explore services to make a booking.' :
          'Failed to load your bookings. Please try again later.';
          
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated, retries]);
  
  // Function to retry loading bookings
  const handleRetry = () => {
    setRetries(prev => prev + 1);
  };
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'confirmed'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });
  
  if (!isAuthenticated) {
    return (
      <div class="min-h-screen bg-gray-100 flex justify-center items-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 class="text-2xl font-bold text-[#16325B] mb-4">Not Authenticated</h2>
          <p class="text-gray-700 mb-6">Please log in to view your bookings.</p>
          <Link href="/login?returnUrl=%2Fbookings" class="inline-block bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div class="min-h-screen py-8 w-4/5 mx-auto">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-[#16325B] mb-6">My Bookings</h1>
        
        {/* Tabs */}
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('all')}
                class={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-[#16325B] text-[#16325B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setActiveTab('active')}
                class={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-[#16325B] text-[#16325B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                class={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-[#16325B] text-[#16325B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                class={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-[#16325B] text-[#16325B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled
              </button>
            </nav>
          </div>
        </div>
        
        {/* Bookings List */}
        <div class="max-w-4xl mx-auto">
          {loading ? (
            <div class="flex justify-center items-center h-64">
              <div class="w-12 h-12 border-4 border-[#FFDC7F] border-t-[#16325B] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p class="mb-2">{error}</p>
              <div class="flex justify-end">
                <button 
                  onClick={handleRetry} 
                  class="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
              <p class="text-gray-500 mb-4">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet." 
                  : `You don't have any ${activeTab} bookings.`}
              </p>
              <Link href="/explore" class="inline-block bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded-lg transition duration-300">
                Explore Services
              </Link>
            </div>
          ) : (
            <div>
              {filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings; 