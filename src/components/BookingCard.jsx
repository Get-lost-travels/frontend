import { h } from 'preact';
import { Link } from 'preact-router';
import { useState } from 'preact/hooks';
import { cancelBooking, downloadETicket, downloadInvoice } from '../api/bookings';

const BookingCard = ({ booking }) => {
  const [cancelling, setCancelling] = useState(false);
  const [downloadingTicket, setDownloadingTicket] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  
  if (!booking || !booking.service) {
    return null;
  }
  
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      // Update booking status in UI
      booking.status = 'cancelled';
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };
  
  const handleDownloadTicket = async () => {
    setDownloadingTicket(true);
    try {
      const blob = await downloadETicket(booking.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `eticket_${booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading e-ticket:', err);
      alert('Failed to download e-ticket. Please try again later.');
    } finally {
      setDownloadingTicket(false);
    }
  };
  
  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      const blob = await downloadInvoice(booking.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice_${booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again later.');
    } finally {
      setDownloadingInvoice(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#16325B] truncate">
            {booking.service.title}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Booking ID</span>
            <p className="font-medium">{booking.id}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Date</span>
            <p className="font-medium">{formatDate(booking.bookingDate)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total Amount</span>
            <p className="font-medium">${booking.service.price}</p>
          </div>
        </div>
        
        {booking.specialRequests && (
          <div className="mb-4">
            <span className="text-sm text-gray-500">Special Requests</span>
            <p className="text-gray-700 bg-gray-50 p-2 rounded-md mt-1 text-sm">
              {booking.specialRequests}
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50 flex flex-wrap gap-2 justify-end">
        <Link 
          href={`/service/${booking.service.id}`}
          className="text-[#227B94] hover:text-[#16325B] text-sm mr-auto"
        >
          View Service
        </Link>
        
        {['pending', 'confirmed'].includes(booking.status) && (
          <button 
            onClick={handleCancel}
            className="bg-white hover:bg-red-50 text-red-600 text-sm py-1 px-3 rounded border border-red-300 flex items-center"
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelling...
              </>
            ) : 'Cancel Booking'}
          </button>
        )}
        
        {booking.status === 'confirmed' && (
          <button 
            onClick={handleDownloadTicket}
            className="bg-white hover:bg-gray-50 text-[#16325B] text-sm py-1 px-3 rounded border border-gray-300 flex items-center"
            disabled={downloadingTicket}
          >
            {downloadingTicket ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-[#16325B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : 'E-Ticket'}
          </button>
        )}
        
        <button 
          onClick={handleDownloadInvoice}
          className="bg-white hover:bg-gray-50 text-[#16325B] text-sm py-1 px-3 rounded border border-gray-300 flex items-center"
          disabled={downloadingInvoice}
        >
          {downloadingInvoice ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-[#16325B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : 'Invoice'}
        </button>
      </div>
    </div>
  );
};

export default BookingCard; 