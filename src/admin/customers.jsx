
import { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("users/customers/");
        setCustomers(response.data.customers || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        toast.error("Failed to load customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Handle delete customer (placeholder for actual API call)
  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`users/customers/${customerId}/`);
        setCustomers(customers.filter((customer) => customer.id !== customerId));
        toast.success("Customer deleted successfully");
      } catch (err) {
        console.error("Failed to delete customer:", err);
        toast.error("Failed to delete customer");
      }
    }
  };

  return (
    <div className="md:ml-64 pt-16 bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers</h2>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No customers found.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-700">Name</th>
                  <th className="p-4 text-sm font-medium text-gray-700 hidden sm:table-cell">Email</th>
                  <th className="p-4 text-sm font-medium text-gray-700 hidden md:table-cell">Phone Number</th>
                  <th className="p-4 text-sm font-medium text-gray-700 hidden lg:table-cell">Role</th>
                  <th className="p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-700">
                            {customer.firstName?.charAt(0)}
                            {customer.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">{customer.email}</p>
                          <p className="text-xs text-gray-500 md:hidden">{customer.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 hidden sm:table-cell">{customer.email}</td>
                    <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{customer.phoneNumber}</td>
                    <td className="p-4 text-sm text-gray-600 hidden lg:table-cell">{customer.role}</td>
                    <td className="p-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => alert(`View details for ${customer.firstName}`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default Customers;