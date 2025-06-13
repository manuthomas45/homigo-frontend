const TechnicianDashboard = () => {
  return (
    <main className="flex-1 p-6 " >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Technician Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Total Services</h3>
          <p className="text-3xl font-bold text-blue-600">25</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Pending Chats</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Wallet Balance</h3>
          <p className="text-3xl font-bold text-green-600">$1,250</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Completed Jobs</h3>
          <p className="text-3xl font-bold text-purple-600">15</p>
        </div>
      </div>

      {/* Dummy Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Recent Service Requests
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left">
                <th className="px-4 py-2">Service ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">SR001</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">Plumbing</td>
                <td className="px-4 py-2 text-yellow-600">Pending</td>
                <td className="px-4 py-2">2025-06-08</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">SR002</td>
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">Electrical</td>
                <td className="px-4 py-2 text-green-600">Completed</td>
                <td className="px-4 py-2">2025-06-07</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">SR003</td>
                <td className="px-4 py-2">Mike Johnson</td>
                <td className="px-4 py-2">HVAC</td>
                <td className="px-4 py-2 text-red-600">Cancelled</td>
                <td className="px-4 py-2">2025-06-06</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TechnicianDashboard;