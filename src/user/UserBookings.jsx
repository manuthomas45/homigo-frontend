import React, { useState, useEffect } from 'react';
import Navbar from './Home/Navbar';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, UserIcon, XCircleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintImage, setComplaintImage] = useState(null);
  const [activeTab, setActiveTab] = useState('booked');
  const navigate = useNavigate();

  // Fetch bookings and wallet balance on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('bookings/user/');
        setBookings(response.data.bookings);
        setWalletBalance(response.data.wallet_balance || '0.00');
        console.log(response.data);
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

  // Handle opening the cancel confirmation dialog
  const handleOpenCancelDialog = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  // Handle closing the cancel dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelBookingId(null);
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      const response = await api.post(`bookings/${cancelBookingId}/cancel/`);
      setMessage(response.data.message);
      setToastOpen(true);
      // Refetch bookings and wallet balance
      const fetchResponse = await api.get('bookings/user/');
      setBookings(fetchResponse.data.bookings);
      setWalletBalance(fetchResponse.data.wallet_balance || '0.00');
      setLoading(false);
      handleCloseCancelDialog();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking.');
      setToastOpen(true);
      setLoading(false);
      handleCloseCancelDialog();
    }
  };

  // Handle opening the complaint dialog
  const handleOpenComplaintDialog = (booking) => {
    setSelectedBooking(booking);
    setComplaintTitle('');
    setComplaintDescription('');
    setComplaintImage(null);
    setComplaintDialogOpen(true);
  };

  // Handle closing the complaint dialog
  const handleCloseComplaintDialog = () => {
    setComplaintDialogOpen(false);
    setSelectedBooking(null);
    setComplaintTitle('');
    setComplaintDescription('');
    setComplaintImage(null);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComplaintImage(file);
    }
  };

  // Validate complaint inputs
  const validateComplaint = () => {
    const errors = [];
    const titleWords = complaintTitle.trim().split(/\s+/).filter(word => word.length > 0);
    const descriptionWords = complaintDescription.trim().split(/\s+/).filter(word => word.length > 0);

    if (titleWords.length < 2) {
      errors.push('Title must have at least 2 words.');
    }
    if (descriptionWords.length < 5) {
      errors.push('Description must have at least 5 words.');
    }
    if (!complaintImage) {
      errors.push('Image is required.');
    }

    return errors;
  };

  // Handle submitting the complaint
  const handleSubmitComplaint = async () => {
    // Validate inputs
    const errors = validateComplaint();
    if (errors.length > 0) {
      setError(errors.join(' '));
      setToastOpen(true);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('booking', selectedBooking.id);
      formData.append('title', complaintTitle);
      formData.append('description', complaintDescription);
      formData.append('image', complaintImage);

      const response = await api.post('bookings/complaints/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      setToastOpen(true);
      setLoading(false);
      handleCloseComplaintDialog();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint.');
      setToastOpen(true);
      setLoading(false);
    }
  };

  // Handle closing the toast
  const handleCloseToast = () => {
    setToastOpen(false);
    setMessage(null);
    setError(null);
  };

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

  // Filter and sort bookings
  const bookedBookings = bookings.filter((booking) => booking.status.toLowerCase() === 'booked');
  const confirmedAndCompletedBookings = bookings
    .filter((booking) => ['confirmed', 'completed'].includes(booking.status.toLowerCase()))
    .sort((a, b) => {
      if (a.status.toLowerCase() === 'confirmed' && b.status.toLowerCase() === 'completed') return -1;
      if (a.status.toLowerCase() === 'completed' && b.status.toLowerCase() === 'confirmed') return 1;
      return 0;
    });
  const cancelledBookings = bookings.filter((booking) => booking.status.toLowerCase() === 'cancelled');

  // Render individual booking card
  const renderBookingCard = (booking) => (
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
              ? new Date(booking.booking_date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
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
            onClick={() => handleOpenCancelDialog(booking.id)}
            className="mt-4 flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-red-300"
            disabled={loading}
          >
            <XCircleIcon className="h-5 w-5 mr-2" />
            Cancel Booking
          </button>
        )}
      {booking.status.toLowerCase() === 'completed' && (
        <button
          onClick={() => handleOpenComplaintDialog(booking)}
          className="mt-4 flex items-center bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
        >
          Give Complaint
        </button>
      )}
      {booking.status.toLowerCase() === 'confirmed' && (
        <button
          onClick={() => navigate('/user-chat', { state: { bookingId: boarding.id } })}
          className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
          Go to Chat
        </button>
      )}
    </div>
  );

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

  if (error && !toastOpen) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Bookings</h1>

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || message}
          </Alert>
        </Snackbar>

        {/* Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCloseCancelDialog}
          aria-labelledby="cancel-booking-dialog-title"
          aria-describedby="cancel-booking-dialog-description"
        >
          <DialogTitle id="cancel-booking-dialog-title">Confirm Cancellation</DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-booking-dialog-description">
              Are you sure you want to cancel this booking? The booking amount will be refunded to your wallet.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseCancelDialog}
              sx={{ color: '#6b7280' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCancelBooking}
              variant="contained"
              sx={{ backgroundColor: '#dc2626', '&:hover': { backgroundColor: '#b91c1c' } }}
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Complaint Dialog */}
        <Dialog
          open={complaintDialogOpen}
          onClose={handleCloseComplaintDialog}
          aria-labelledby="complaint-dialog-title"
          aria-describedby="complaint-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="complaint-dialog-title">Submit Complaint</DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <div>
                <p><strong>Technician:</strong> {selectedBooking.technician?.user?.firstName || 'N/A'} {selectedBooking.technician?.user?.lastName || 'N/A'} ({selectedBooking.technician?.user?.email || 'N/A'}, {selectedBooking.technician?.user?.phoneNumber || 'N/A'}, {selectedBooking.technician?.city || 'N/A'})</p>
                <p><strong>Service:</strong> {selectedBooking.service_type?.name || 'N/A'} ({selectedBooking.category?.name || 'N/A'})</p>
                <TextField
                  label="Complaint Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  required
                  error={toastOpen && complaintTitle.trim().split(/\s+/).filter(word => word.length > 0).length < 2}
                  helperText={toastOpen && complaintTitle.trim().split(/\s+/).filter(word => word.length > 0).length < 2 ? 'Title must have at least 2 words' : ''}
                />
                <TextField
                  label="Complaint Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  required
                  error={toastOpen && complaintDescription.trim().split(/\s+/).filter(word => word.length > 0).length < 5}
                  helperText={toastOpen && complaintDescription.trim().split(/\s+/).filter(word => word.length > 0).length < 5 ? 'Description must have at least 5 words' : ''}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-4"
                  required
                />
                {toastOpen && !complaintImage && (
                  <p className="text-red-600 text-sm mt-2">Image is required</p>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseComplaintDialog}
              sx={{ color: '#6b7280' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitComplaint}
              variant="contained"
              sx={{ backgroundColor: '#f59e0b', '&:hover': { backgroundColor: '#d97706' } }}
              autoFocus
              disabled={loading}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'booked'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Booked
          </button>
          <button
            onClick={() => setActiveTab('confirmedAndCompleted')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'confirmedAndCompleted'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Confirmed & Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'cancelled'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Booked Section */}
        {activeTab === 'booked' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booked Bookings</h2>
            {bookedBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 mb-4">No booked bookings found.</p>
                <button
                  onClick={() => navigate('/services')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Book a Service Now
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {bookedBookings.map(renderBookingCard)}
              </div>
            )}
          </div>
        )}

        {/* Confirmed & Completed Section */}
        {activeTab === 'confirmedAndCompleted' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmed & Completed Bookings</h2>
            {confirmedAndCompletedBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 mb-4">No confirmed or completed bookings found.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {confirmedAndCompletedBookings.map(renderBookingCard)}
              </div>
            )}
          </div>
        )}

        {/* Cancelled Section */}
        {activeTab === 'cancelled' && (
          <div>
            {/* Wallet Balance Display */}
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">
                Wallet Balance: ${walletBalance}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancelled Bookings</h2>
            {cancelledBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 mb-4">No cancelled bookings found.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {cancelledBookings.map(renderBookingCard)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserBookings;