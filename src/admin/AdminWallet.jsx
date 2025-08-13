import React, { useState, useEffect } from 'react';
import NavbarSidebar from './Navbar';
import api from '../api';
import { toast } from 'react-toastify';

const AdminWallet = () => {
  const [adminEarnings, setAdminEarnings] = useState(0);
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminWalletData();
  }, []);

  const fetchAdminWalletData = async () => {
    try {
      setLoading(true);
      const response = await api.get('adminpanel/wallet/');
      if (response.data.success) {
        setAdminEarnings(response.data.admin_earnings);
        setTotalCompletedAmount(response.data.total_completed_amount);
        setCompletedBookings(response.data.completed_bookings);
      } else {
        toast.error('Failed to fetch admin wallet data');
      }
    } catch (error) {
      console.error('Admin Wallet Fetch Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching admin wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <NavbarSidebar />
        <div className="pt-[92px] md:pl-64 p-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarSidebar />
      <div className="pt-[92px] md:pl-64 p-12">
        <h1 className="text-2xl font-bold mb-6">Admin Wallet</h1>
        <div className="bg-blue-100 p-4 rounded-lg mb-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Admin Earnings</h2>
          <p className="text-3xl font-bold text-blue-700">₹{adminEarnings.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            (10% of total completed amount: ₹{totalCompletedAmount.toFixed(2)})
          </p>
        </div>

        {/* Completed Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Completed Bookings</h2>
          {completedBookings.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No completed bookings found.</p>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Admin Earnings</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">City</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service_type} ({booking.category})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{booking.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      ₹{booking.admin_earnings.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.booking_date || 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;