import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../api';
import TechnicianNavbarSidebar from './TechnicianNavbarSidebar';
import { MapPin } from 'lucide-react';

const TechnicianBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchAvailableBookings();
    } else {
      fetchAcceptedBookings();
    }
  }, [activeTab]);

  const fetchAvailableBookings = async (query = '') => {
    try {
      setLoading(true);
      const response = await api.get('/technician/bookings/available/', {
        params: { search: query }
      });
      console.log('Available Bookings Response:', response.data);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        toast.error('Failed to fetch available bookings');
      }
    } catch (error) {
      console.error('Fetch Available Bookings Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedBookings = async (query = '') => {
    try {
      setLoading(true);
      const response = await api.get('/technician/bookings/accepted/', {
        params: { search: query }
      });
      console.log('Accepted Bookings Response:', response.data);
      if (response.data.success) {
        setAcceptedBookings(response.data.bookings);
      } else {
        toast.error('Failed to fetch accepted bookings');
      }
    } catch (error) {
      console.error('Fetch Accepted Bookings Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching accepted bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'bookings') {
      fetchAvailableBookings(searchQuery);
    } else {
      fetchAcceptedBookings(searchQuery);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Accept Booking?',
      text: 'Do you want to accept this booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Accept!'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post(`/technician/bookings/${bookingId}/accept/`);
        if (response.data.success) {
          setBookings(bookings.filter(booking => booking.id !== bookingId));
          toast.success('Booking accepted successfully!');
          Swal.fire('Accepted!', 'Booking has been accepted.', 'success');
        } else {
          toast.error('Failed to accept booking');
        }
      } catch (error) {
        console.error('Accept Booking Error:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'An error occurred while accepting booking');
      }
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Complete Booking?',
      text: 'Mark this booking as completed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Complete!'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post(`/technician/bookings/${bookingId}/complete/`);
        if (response.data.success) {
          setAcceptedBookings(acceptedBookings.filter(booking => booking.id !== bookingId));
          toast.success('Booking completed successfully!');
          Swal.fire('Completed!', 'Booking has been marked as completed.', 'success');
        } else {
          toast.error('Failed to complete booking');
        }
      } catch (error) {
        console.error('Complete Booking Error:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'An error occurred while completing booking');
      }
    }
  };

  const showAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setSelectedAddress(null);
  };

  const renderBookingsTable = (bookingsData, isAccepted = false) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (bookingsData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {isAccepted ? 'No accepted bookings found' : 'No available bookings found'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">City</th>
              <th className="px-6 py-3 font-medium">Service</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Address</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookingsData.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.customer_name}</div>
                    <div className="text-gray-500">{booking.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin size={16} className="text-red-500 mr-2" />
                    {booking.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.service_type}</div>
                    <div className="text-gray-500">{booking.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{booking.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.booking_date ? (
                    new Date(booking.booking_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => showAddress(booking.address)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Show Address
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isAccepted ? (
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAcceptBooking(booking.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <TechnicianNavbarSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Bookings
              {bookings.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs">
                  {bookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accepted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Accepted Bookings
              {acceptedBookings.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-600 py-1 px-2 rounded-full text-xs">
                  {acceptedBookings.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'bookings' 
          ? renderBookingsTable(bookings, false)
          : renderBookingsTable(acceptedBookings, true)
        }

        {/* Address Modal */}
        {showAddressModal && selectedAddress && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Customer Address</h3>
                  <button
                    onClick={closeAddressModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAddress.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAddress.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAddress.state}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pincode</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAddress.pincode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAddress.phone_number}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeAddressModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TechnicianNavbarSidebar>
  );
};

export default TechnicianBookings;