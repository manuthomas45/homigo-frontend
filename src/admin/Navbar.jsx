"use client"

import { useState } from "react"
import { FaWrench } from 'react-icons/fa';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  HardHatIcon as UserHardHat,
  CheckSquare,
  Inbox,
  Wallet,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from "../store/userSlice";
import api from "../api";
import { toast } from 'react-toastify';

const NavbarSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await api.post('users/logout/', {});
      // Clear access token from localStorage
      localStorage.removeItem('access_token');
      // Clear user state in Redux
      dispatch(clearUser());
      // Show success message
      toast.success('Logged out successfully');
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error.message);
      // Even if the API call fails, clear client-side data and redirect
      localStorage.removeItem('access_token');
      dispatch(clearUser());
      toast.error('An error occurred while logging out');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-20">
        <div className="flex items-center">
          <button className="md:hidden mr-2 text-gray-600" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold text-purple-700">HomiGo</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-700">JR</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">James Raj</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[56px] left-0 bottom-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          z-10
          w-64 
          bg-white 
          border-r border-gray-200 
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 py-24">
            <ul className="space-y-1 px-3">
              <SidebarItem icon={<LayoutDashboard size={18} />} text="Dashboard" to="/admin" />
              <SidebarItem icon={<Briefcase size={18} />} text="Category" to="/admin/services" />
              <SidebarItem icon={<UserHardHat size={18} />} text="Technicians" to="/admin/technicians" />
              <SidebarItem icon={<Users size={18} />} text="Customers" to="/admin/customers" />
              <SidebarItem icon={<FaWrench size={18} />} text="Services" to="/admin/service-types" />
              <SidebarItem icon={<CheckSquare size={18} />} text="Bookings" to="/admin/bookings" />
              <SidebarItem icon={<Inbox size={18} />} text="Inbox" to="/admin/inbox" />
              <SidebarItem icon={<Wallet size={18} />} text="Wallet" to="/admin/wallet" />
              <SidebarItem icon={<BarChart3 size={18} />} text="Reports" to="/admin/reports" />
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center text-gray-700 hover:text-gray-900" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={toggleSidebar}
          style={{ top: "56px" }}
        />
      )}
    </>
  );
};

const SidebarItem = ({ icon, text, to, active }) => {
  return (
    <li>
      <Link
        to={to}
        className={`
          flex items-center px-3 py-2 rounded-md text-sm
          ${active ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"}
        `}
      >
        <span className="mr-2">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default NavbarSidebar;