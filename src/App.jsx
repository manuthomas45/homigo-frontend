import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { clearUser } from './store/userSlice';
import Login from './user/signin/Signin';
import VerifyOTP from './user/otppage/Otp';
import Home from './user/Home/Home';
import Register from './user/singup/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './admin/AdminDashboard';
import Profile from './user/Profile/Profile';
import ResetPassword from './user/ResetPassword';
import ForgotPassword from './user/ForgotPassword';
import 'leaflet/dist/leaflet.css';
// import TechnicianLogin from './technician/TechnicianLogin';
import TechnicianRegister from './technician/TechnicianRegister';
import TechnicianHome from './technician/TechnicianHome';
import TechnicianProfile from './technician/TechnicianProfile'; // Import the new component
import Customers from './admin/customers';
import Technicians from './admin/Technicians';
import Services from './admin/Services';
import ServiceTypes from './admin/SeviceType';
import ServicePage from './user/servicePage';
import BookingPage from './user/BookingPage';
import BookingSuccess from './user/BookingSucess';
import Bookings from './admin/Bookings';
import TechnicianBookings from './technician/TechnicianBooking';
import TechnicianWallet from './technician/TechnicianWallet';
import AdminWallet from './admin/AdminWallet';
import UserBookings from './user/UserBookings';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleTokenRefreshFailed = () => {
      console.log('Token refresh failed, clearing user state');
      dispatch(clearUser());
    };

    window.addEventListener('token-refresh-failed', handleTokenRefreshFailed);

    return () => {
      window.removeEventListener('token-refresh-failed', handleTokenRefreshFailed);
    };
  }, [dispatch]);

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/services" element={<ServicePage/>}/>
        <Route path="/booking" element={<BookingPage/>} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute allowedRole="admin"><Customers /></ProtectedRoute>} />
        <Route path="/admin/technicians" element={<ProtectedRoute allowedRole="admin"><Technicians /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute allowedRole="admin"><Services /></ProtectedRoute>} />
        <Route path="/admin/service-types" element={<ProtectedRoute allowedRole="admin"><ServiceTypes /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRole="admin"><Bookings /></ProtectedRoute>} />
        <Route path="/admin/wallet" element={<ProtectedRoute allowedRole="admin"><AdminWallet /></ProtectedRoute>} />

        {/* User Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />
        <Route path="/user-bookings" element={<ProtectedRoute allowedRole="user"><UserBookings /></ProtectedRoute>} />

        {/* Technician Routes */}
        <Route path="/technician-register" element={<ProtectedRoute allowedRole="user"><TechnicianRegister /></ProtectedRoute>} />
        <Route path="/technician-home" element={<ProtectedRoute allowedRole="technician"><TechnicianHome /></ProtectedRoute>} />
        <Route path="/technician-profile" element={<ProtectedRoute allowedRole="technician"><TechnicianProfile /></ProtectedRoute>} /> {/* Added new route */}
        <Route path="/technician-bookings" element={<ProtectedRoute allowedRole="technician"><TechnicianBookings /></ProtectedRoute>} />        
        <Route path="/technician-bookings" element={<ProtectedRoute allowedRole="technician"><TechnicianBookings /></ProtectedRoute>} />        
        <Route path="/technician-wallet" element={<ProtectedRoute allowedRole="technician"><TechnicianWallet /></ProtectedRoute>} />        

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}

export default App;