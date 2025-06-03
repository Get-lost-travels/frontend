import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAgencyBookings, confirmBooking, cancelBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';

const AgencyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'agency') return;
    setLoading(true);
    getAgencyBookings()
      .then(res => setBookings(res.bookings || []))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const handleConfirm = async (id) => {
    setActionLoading(a => ({ ...a, [id]: 'confirm' }));
    try {
      await confirmBooking(id);
      setBookings(bks => bks.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    } catch {
      alert('Failed to confirm booking.');
    } finally {
      setActionLoading(a => ({ ...a, [id]: null }));
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(a => ({ ...a, [id]: 'cancel' }));
    try {
      await cancelBooking(id);
      setBookings(bks => bks.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch {
      alert('Failed to cancel booking.');
    } finally {
      setActionLoading(a => ({ ...a, [id]: null }));
    }
  };

  if (!isAuthenticated || user?.role !== 'agency') {
    return <div class="p-8 text-center">You must be logged in as an agency to view bookings.</div>;
  }

  if (loading) return <div class="p-8 text-center">Loading bookings...</div>;
  if (error) return <div class="p-8 text-center text-red-600">{error}</div>;

  return (
    <div class="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold mb-6 text-[#16325B]">Bookings for Your Offers</h1>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2">Service</th>
              <th class="p-2">Customer</th>
              <th class="p-2">Date</th>
              <th class="p-2">Status</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} class="border-t">
                <td class="p-2">{b.Service?.Title || b.service?.title}</td>
                <td class="p-2">{b.User?.Username || b.user?.username || 'N/A'}</td>
                <td class="p-2">{new Date(b.BookingDate || b.bookingDate).toLocaleDateString()}</td>
                <td class="p-2 capitalize">{b.Status || b.status}</td>
                <td class="p-2 space-x-2">
                  {(b.Status === 'pending' || b.status === 'pending') && (
                    <button onClick={() => handleConfirm(b.id)} disabled={actionLoading[b.id] === 'confirm'} class="bg-green-600 text-white px-3 py-1 rounded mr-2">
                      {actionLoading[b.id] === 'confirm' ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}
                  {(b.Status === 'pending' || b.Status === 'confirmed' || b.status === 'pending' || b.status === 'confirmed') && (
                    <button onClick={() => handleCancel(b.id)} disabled={actionLoading[b.id] === 'cancel'} class="bg-red-600 text-white px-3 py-1 rounded">
                      {actionLoading[b.id] === 'cancel' ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgencyBookings;
