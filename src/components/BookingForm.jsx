import { h } from 'preact';
import { useState } from 'preact/hooks';
import { bookService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { route } from 'preact-router';

const BookingForm = ({ service, onSuccess }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      route('/login?redirect=' + encodeURIComponent(`/service/${service.id}`));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bookingData = {
        serviceId: service.id,
        numberOfPeople,
        specialRequests,
        totalAmount: service.price * numberOfPeople
      };
      
      const response = await bookService(service.id, bookingData);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error('Error booking service:', err);
      setError('Failed to book service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-[#16325B] mb-4">Book This Trip</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Number of People
          </label>
          <div className="flex items-center">
            <button 
              type="button" 
              className="bg-gray-200 rounded-l-md px-3 py-2"
              onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <input 
              type="number" 
              className="w-16 text-center cursor-pointer border-t border-b border-gray-300 py-2"
              value={numberOfPeople}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1) {
                  setNumberOfPeople(value);
                }
              }}
              min="1"
              required
            />
            <button 
              type="button" 
              className="bg-gray-200 cursor-pointer rounded-r-md px-3 py-2"
              onClick={() => setNumberOfPeople(prev => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Special Requests (optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any dietary requirements, accessibility needs, or special requests?"
          ></textarea>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between">
            <span className="text-gray-600">Price per person:</span>
            <span className="font-medium">${service.price}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">Number of people:</span>
            <span className="font-medium">{numberOfPeople}</span>
          </div>
          <div className="flex justify-between mt-2 text-lg font-bold text-[#16325B]">
            <span>Total:</span>
            <span>${(service.price * numberOfPeople).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#16325B] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Book Now'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm; 