import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../api';
import NavbarSidebar from './Navbar';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const response = await api.get('/adminpanel/users/', {
        params: { search: query }
      });
      console.log('Fetch Users Response:', response.data);
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch Users Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchQuery);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'block' : 'unblock';
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} user!`
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post(`/adminpanel/users/${userId}/toggle-status/`);
        if (response.data.success) {
          setUsers(users.map(user =>
            user.id === userId ? { ...user, status: response.data.user.status } : user
          ));
          Swal.fire(
            'Success!',
            `User has been ${action}ed.`,
            'success'
          );
        } else {
          toast.error('Failed to update user status');
        }
      } catch (error) {
        console.error('Toggle Status Error:', error.response?.data || error.message);
        toast.error('An error occurred while updating user status');
      }
    }
  };

  return (
    <>
      <NavbarSidebar />
      <div className="pt-[72px] md:pl-64 p-12">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>

        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2 px-4 font-medium">ID</th>
                  <th className="pb-2 px-4 font-medium">First Name</th>
                  <th className="pb-2 px-4 font-medium">Last Name</th>
                  <th className="pb-2 px-4 font-medium">Email</th>
                  <th className="pb-2 px-4 font-medium">Phone</th>
                  <th className="pb-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4">{user.firstName}</td>
                    <td className="py-3 px-4">{user.lastName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phoneNumber}</td>
                    <td className="py-3 px-4">
                      {user.status === 'active' || user.status === 'blocked' ? (
                        <button
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`px-3 py-1 text-white rounded text-xs ${
                            user.status === 'active'
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {user.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Customers;