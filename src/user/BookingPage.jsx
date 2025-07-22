import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Home/Navbar';
// import api from '../api/userserviceapi';


const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  console.log(user)
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState(null);
  const serviceType = state?.serviceType;
  const categoryName = state?.categoryName;

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await api.get(`/users/profile/${user.id}/`);
        const addresses = response.data.addresses || [];
        const defaultAddress = addresses.find(a => a.is_default);
        setAddress(defaultAddress || addresses[0]);
      } catch (error) {
        toast.error('Failed to load user address');
        setAddress(null);
      }
    };
    if (user?.id) fetchUserAddress();
  }, [user?.id]);

  if (!serviceType) {
    navigate('/services');
    toast.error('No service selected');
    return null;
  }

  return (
    <><Navbar/>
    <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen py-20">
      <div className="relative container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Book Your Service</h2>

          {/* Service Details */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Service Details</h3>
            <div className="mt-4 space-y-2">
              <p><strong>Category:</strong> {categoryName}</p>
              <p><strong>Service:</strong> {serviceType.name}</p>
              <p><strong>Price:</strong> ₹{serviceType.rate}</p>
              {serviceType.description && <p><strong>Description:</strong> {serviceType.description}</p>}
              {serviceType.image_url && (
                <img
                  src={serviceType.image_url}
                  alt={serviceType.name}
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
            {address ? (
              <p className="mt-2 text-gray-600">{address.address_line1}, {address.city}</p>
            ) : (
              <p className="mt-2 text-gray-600">No address available. Please update your profile.</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Select Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select a date"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {
              if (selectedDate && address) {
                toast.success('Booking confirmed!');
                navigate('/services');
              } else {
                toast.error('Please select a date and ensure an address is available');
              }
            }}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </section>
    </>
  );
};

export default BookingPage;