import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = !!user;
  const userRole = user?.role || null;
  const location = useLocation();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - IsAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - UserRole:', userRole);
  console.log('ProtectedRoute - Current Path:', location.pathname);

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Redirecting to /login because user is not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'admin' && location.pathname !== '/admin') {
    console.log('ProtectedRoute - Redirecting admin to /admin');
    return <Navigate to="/admin" replace />;
  }

  if (allowedRole === 'admin' && userRole !== 'admin') {
    console.log('ProtectedRoute - Redirecting non-admin to /');
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    console.log(`ProtectedRoute - Redirecting to / because role (${userRole}) does not match allowedRole (${allowedRole})`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;