import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from './Home/Navbar';
import api from '../api';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No payment session found');
      setLoading(false);
      return;
    }

    if (!user?.id) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    const handlePaymentSuccess = async () => {
  try {

    if (!sessionId) {
      setError('No payment session found');
      setLoading(false);
      return;
    }

    // 🔥 Send only session_id
    const response = await api.post('/bookings/create-booking/', {
      session_id: sessionId,
    });

    setBookingData(response.data);
    toast.success('Booking confirmed successfully!');
    setSessionData({
      session_id: sessionId,
      amount_total: response.data.amount,
      payment_status: response.data.payment_status || 'paid',
      booking_date: response.data.booking_date,
      service_name: response.data.service_name,
      category_name: response.data.category_name,
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    toast.error('Failed to confirm booking');
    setError('Something went wrong while confirming the booking.');
  } finally {
    setLoading(false);
  }
};


    handlePaymentSuccess();
  }, [searchParams, user, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen pt-8 pb-20">
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

          <div className="relative container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-12 text-center max-w-md">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your booking...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen pt-8 pb-20">
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

          <div className="relative container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-12 text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Error</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/services')}
                  className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
                >
                  Back to Services
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen pt-8 pb-20">
        {/* Background elements */}
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

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-sky-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative container mx-auto px-4">
          {/* Success Header */}
          <div className={`text-center mb-12 space-y-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Booking
                <span className="text-green-500"> Confirmed!</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mx-auto"></div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
              Your payment was successful and your service has been booked. We'll contact you soon with further details.
            </p>
          </div>

          {/* Booking Details */}
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-8 max-w-2xl mx-auto">
              
              {/* Booking Information */}
              {bookingData && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
                  <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="font-semibold text-gray-900">#{bookingData.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold text-gray-900">{sessionData?.service_name || 'Service'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Category</span>
                      <span className="font-semibold text-gray-900">{sessionData?.category_name || 'Category'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Scheduled Date</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.booking_date ? new Date(bookingData.booking_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {sessionData && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                  <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="text-2xl font-bold text-green-600">₹{sessionData.amount_total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-900">{sessionData.session_id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h3>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Confirmation Email</h4>
                        <p className="text-gray-600 text-sm">You'll receive a confirmation email with all booking details within 5 minutes.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Service Assignment</h4>
                        <p className="text-gray-600 text-sm">Our team will assign a qualified professional for your service.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Service Delivery</h4>
                        <p className="text-gray-600 text-sm">The professional will contact you before the scheduled date to confirm details.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/services')}
                  className="flex-1 font-medium px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                >
                  Book Another Service
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 group bg-blue-500 text-white font-medium px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <span className="flex items-center justify-center">
                    View My Bookings
                    <div className="ml-3 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </span>
                </button>
              </div>

              {/* Support Notice */}
              <div className="mt-8 text-center">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">Need help or have questions?</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <button 
                      onClick={() => navigate('/contact')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Contact Support
                    </button>
                    <span className="text-blue-400">|</span>
                    <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 font-medium">
                      Call: +91 98765 43210
                    </a>
                  </div>
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

export default BookingSuccess;