import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { clearUser } from './store/userSlice';
import Login from './user/signin/Signin';
import VerifyOTP from './user/otppage/Otp';
import Home from './user/Home/Home';
import Register from './user/singup/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './admin/AdminDashboard'
import Profile from './user/Profile/Profile';
import ResetPassword from './user/ResetPassword';
import ForgotPassword from './user/ForgotPassword';
import 'leaflet/dist/leaflet.css';
// import TechnicianLogin from './technician/TechnicianLogin';
import TechnicianRegister from './technician/TechnicianRegister';
import TechnicianHome from './technician/TechnicianHome';



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
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={ <Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* admin Routes */}
        <Route path="/admin" element={ <ProtectedRoute allowedRole="admin"> <AdminDashboard /> </ProtectedRoute>  } />


        {/* user Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRole="user"> <Profile /></ProtectedRoute>}/>


        {/* technician routes */}
        <Route path="/technician-register" element={<ProtectedRoute allowedRole="user"> <TechnicianRegister /></ProtectedRoute>} />
        <Route path="/technician-home" element={<ProtectedRoute allowedRole="technician"> <TechnicianHome /></ProtectedRoute>} />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;