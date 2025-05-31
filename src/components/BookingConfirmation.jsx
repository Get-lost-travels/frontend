import { h } from 'preact';
import { Link } from 'preact-router';
import { useState } from 'preact/hooks';
import { downloadETicket, downloadInvoice } from '../api/bookings';

const BookingConfirmation = ({ booking, service, onClose }) => {
  const [downloadingTicket, setDownloadingTicket] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  
  const handleDownloadTicket = async () => {
    if (!booking || !booking.id) return;
    
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
    if (!booking || !booking.id) return;
    
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
  
  if (!booking || !service) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#16325B]">Booking Confirmed</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-center text-gray-700 mb-2">
            Thank you for your booking! Your trip has been successfully reserved.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-[#16325B] mb-2">Booking Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Booking ID:</div>
            <div className="font-medium">{booking.id}</div>
            
            <div className="text-gray-600">Service:</div>
            <div className="font-medium">{service.title}</div>
            
            <div className="text-gray-600">Date:</div>
            <div className="font-medium">
              {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            <div className="text-gray-600">Status:</div>
            <div className="font-medium capitalize">{booking.status}</div>
            
            <div className="text-gray-600">People:</div>
            <div className="font-medium">{booking.numberOfPeople}</div>
            
            <div className="text-gray-600">Total Amount:</div>
            <div className="font-medium">${booking.totalAmount}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-[#16325B] mb-2">What's Next?</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>You'll receive a confirmation email shortly with all the details.</li>
            <li>The travel agency will review your booking and confirm it within 24 hours.</li>
            <li>Once confirmed, you'll be able to download your e-ticket.</li>
            <li>You can view and manage all your bookings from your profile.</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={handleDownloadTicket} 
            className="flex-1 bg-[#16325B] hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg flex justify-center items-center"
            disabled={downloadingTicket || booking.status !== 'confirmed'}
          >
            {downloadingTicket ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Download E-Ticket
              </>
            )}
          </button>
          
          <button 
            onClick={handleDownloadInvoice}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg flex justify-center items-center"
            disabled={downloadingInvoice}
          >
            {downloadingInvoice ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/bookings" className="text-[#227B94] hover:underline">
            View all your bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 