import React, { useState, useEffect } from 'react';
import TechnicianNavbarSidebar from './TechnicianNavbarSidebar';
import api from '../api';
import { toast } from 'react-toastify';

const TechnicianWallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/technician/wallet/');
      if (response.data.success) {
        setWalletBalance(response.data.wallet_balance);
        setCompletedBookings(response.data.completed_bookings);
      } else {
        toast.error('Failed to fetch wallet data');
      }
    } catch (error) {
      console.error('Wallet Fetch Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TechnicianNavbarSidebar>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </TechnicianNavbarSidebar>
    );
  }

  return (
    <TechnicianNavbarSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

        {/* Wallet Balance */}
        <div className="bg-green-100 p-4 rounded-lg mb-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-700">₹{walletBalance.toFixed(2)}</p>
          <p className="text-sm text-gray-600">(90% of completed tasks credited, 10% admin commission)</p>
        </div>

        {/* Completed Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Completed Work</h2>
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
                  <th className="px-6 py-3 font-medium">Earnings</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{booking.earnings.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.booking_date || 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.address.city} ({booking.address.pincode})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </TechnicianNavbarSidebar>
  );
};

export default TechnicianWallet;