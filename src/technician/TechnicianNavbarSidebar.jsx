import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  Wallet,
  LogOut,
  Menu,
  X,
  Calendar, // ✅ Add this import
  User, // Added User icon for Profile
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearUser } from "../store/userSlice";
import api from "../api";

const TechnicianNavbarSidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post('users/logout/', {});
      localStorage.removeItem('access_token');
      dispatch(clearUser());
      toast.success('Logged out successfully');
      navigate('/technician-login');
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error.message);
      localStorage.removeItem('access_token');
      dispatch(clearUser());
      toast.error('An error occurred while logging out');
      navigate('/technician-login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-20 h-14">
        <div className="flex items-center">
          <button className="md:hidden mr-2 text-gray-600" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold text-purple-700">HomiGo</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/technician-profile')}>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-700">TR</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">Technician Name</p>
              <p className="text-xs text-gray-500">Technician</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-14 left-0 bottom-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
            z-10
            w-64 
            bg-white 
            border-r border-gray-200 
            transition-transform duration-300 ease-in-out
            overflow-y-auto
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 py-4">
              <ul className="space-y-1 px-3">
                <SidebarItem icon={<LayoutDashboard size={18} />} text="Dashboard" to="/technician-home" active />
                <SidebarItem icon={<User size={18} />} text="Profile" to="/technician-profile" /> {/* Added Profile option */}
                <SidebarItem icon={<Calendar size={18} />} text="Bookings" to="/technician-bookings" /> {/* ✅ Add this */}
                <SidebarItem icon={<Briefcase size={18} />} text="Services" to="/technician-home/services" />
                <SidebarItem icon={<Inbox size={18} />} text="Chats" to="/technician-home/chats" />
                <SidebarItem icon={<Wallet size={18} />} text="Wallet" to="/technician-home/wallet" />
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200 mt-auto">
              <button className="flex items-center text-gray-700 hover:text-gray-900 w-full" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 bg-gray-100">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          style={{ top: "56px" }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const SidebarItem = ({ icon, text, to, active }) => {
  return (
    <li>
      <Link
        to={to}
        className={`
          flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200
          ${active ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}
        `}
      >
        <span className="mr-2">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default TechnicianNavbarSidebar;