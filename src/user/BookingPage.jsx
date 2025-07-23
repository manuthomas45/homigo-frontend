import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Home/Navbar';
import api from '../api';

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const serviceType = state?.serviceType;
  const categoryName = state?.categoryName;

  console.log(user);
  console.log(user?.id);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await api.get(`/users/addresses/`);
        console.log(response.data);
        console.log('hai');
        const addresses = response.data || [];
        console.log(addresses);
        const defaultAddress = addresses.find((a) => a.is_default);
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

  const handlePayment = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!address) {
      toast.error('Please ensure an address is available');
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session
      const checkoutData = {
        service_type_id: serviceType.id,
        category_name: categoryName,
        service_name: serviceType.name,
        amount: serviceType.rate,
        booking_date: selectedDate.toISOString().split('T')[0],
        user_id: user.id,
        address_id: address.id,
        success_url: `${window.location.origin}/booking-success`,
        cancel_url: `${window.location.origin}/services`,
      };

      const response = await api.post('/bookings/create-checkout-session/', checkoutData);
      
      const { checkout_url } = response.data;

      if (!checkout_url) {
        throw new Error('No checkout URL received from server');
      }

      // Redirect to Stripe Checkout
      window.location.href = checkout_url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session: ' + (error.response?.data?.error || error.message));
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen pt-8 pb-20">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 opacity-40">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#3b82f6" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-sky-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative container mx-auto px-4">
          {/* Page Header */}
          <div className={`text-center mb-12 space-y-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Book Your
                <span className="text-blue-500"> Service</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full mx-auto"></div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
              Complete your booking details and proceed to secure payment
            </p>
          </div>

          {/* Main Booking Card */}
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-8 max-w-2xl mx-auto">
              
              {/* Service Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h3>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white space-y-3">
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
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Address</h3>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  {address ? (
                    <div className="text-gray-600 space-y-1">
                      <p><strong>Address:</strong> {address.address}</p>
                      <p><strong>City:</strong> {address.city}</p>
                      <p><strong>State:</strong> {address.state}</p>
                      <p><strong>Pincode:</strong> {address.pincode}</p>
                      <p><strong>Phone:</strong> {address.phone_number}</p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-amber-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p>No address available. Please update your profile.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Service Date</h3>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholderText="Select a date for your service"
                  />
                  {selectedDate && (
                    <div className="mt-3 flex items-center text-green-600 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Service scheduled for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Service Fee</span>
                    <span className="text-gray-900 font-semibold">₹{serviceType.rate}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Tax & Fees</span>
                    <span className="text-gray-900 font-semibold">₹0</span>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">₹{serviceType.rate}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedDate || !address}
                  className="w-full group bg-blue-500 text-white font-medium px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating checkout session...
                      </>
                    ) : (
                      <>
                        Pay ₹{serviceType.rate}
                        <div className="ml-3 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full font-medium px-8 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                >
                  Back to Services
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}</style>
      </section>
    </>
  );
};

export default BookingPage;