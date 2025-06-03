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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute allowedRole="user">  <Home />  </ProtectedRoute>} />
        <Route path="/admin" element={ <ProtectedRoute allowedRole="admin"> <AdminDashboard /> </ProtectedRoute>  } />
        <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>}/>
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;