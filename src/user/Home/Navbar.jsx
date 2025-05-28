import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogout } from '@react-oauth/google';
import { clearUser } from '../../store/userSlice';
import api from '../../api';

const NavbarSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      await api.post('/users/logout/');
      // Clear Google session
      googleLogout();
      // Clear client-side data
      dispatch(clearUser());
      localStorage.removeItem('access_token');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      // Proceed with client-side logout even if the request fails
      googleLogout();
      dispatch(clearUser());
      localStorage.removeItem('access_token');
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/home" className="hover:text-gray-300">Home</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="flex items-center space-x-2 hover:text-gray-300">
          <span className="text-xl">👤</span>
          <span>{user?.firstName || 'Profile'}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarSidebar;