import React, { useState, useEffect } from 'react';
import Navbar from './Home/Navbar';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, UserIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('bookings/user/');
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchBookings();
  }, [navigate]);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        const response = await api.post(`bookings/${bookingId}/cancel/`);
        setMessage(response.data.message);
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to cancel booking.');
        setLoading(false);
      }
    }
  };

  // Filter bookings by status
  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter((booking) => booking.status.toLowerCase() === filterStatus);

  // Status color mapping
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 max-w-7xl mx-auto p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center animate-fade-in">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {message}
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No bookings found for the selected status.</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Book a Service Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking #{booking.id}
                </h2>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <strong>Service:</strong>{' '}
                      {booking.service_type?.name || 'N/A'} (
                      {booking.category?.name || 'N/A'})
                    </span>
                  </p>
                  <p className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <strong>Address:</strong>{' '}
                      {booking.address?.address || 'N/A'},{' '}
                      {booking.address?.city || 'N/A'},{' '}
                      {booking.address?.state || 'N/A'}{' '}
                      {booking.address?.pincode || 'N/A'}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusStyles(booking.status)}`}
                    >
                      <strong>Status:</strong> {booking.status || 'N/A'}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <strong>Amount:</strong> ${booking.amount || '0.00'}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <strong>Date:</strong>{' '}
                      {booking.booking_date
                        ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })
                        : 'N/A'}
                    </span>
                  </p>
                  {booking.technician && booking.technician.user ? (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span>
                          <strong>Technician:</strong>{' '}
                          {booking.technician.user.firstName}{' '}
                          {booking.technician.user.lastName}
                        </span>
                      </p>
                      <p>
                        <strong>Email:</strong>{' '}
                        {booking.technician.user.email || 'N/A'}
                      </p>
                      <p>
                        <strong>Phone:</strong>{' '}
                        {booking.technician.user.phoneNumber || 'N/A'}
                      </p>
                      <p>
                        <strong>City:</strong>{' '}
                        {booking.technician.city || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No technician assigned yet.
                    </p>
                  )}
                </div>
                {!booking.technician &&
                  booking.status &&
                  !['cancelled', 'completed'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-4 flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-red-300"
                      disabled={loading}
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Cancel Booking
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserBookings;