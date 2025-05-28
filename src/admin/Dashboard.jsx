import { TrendingUp, TrendingDown } from "lucide-react"
import { useSelector } from 'react-redux';

const DashboardContent = () => {
    const user = useSelector((state) => state.user.user);

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <h1>{user ? `Welcome, ${user.email}` : 'No user logged in'}</h1>       


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total User"
          value="40,689"
          change="0.5% Up from yesterday"
          trend="up"
          iconBg="bg-blue-100"
          icon="👤"
        />
        <StatCard
          title="Completed Services"
          value="10293"
          change="1.3% Up from past week"
          trend="up"
          iconBg="bg-yellow-100"
          icon="✓"
        />
        <StatCard
          title="Total Technicians"
          value="30"
          change="4.7% Down from yesterday"
          trend="down"
          iconBg="bg-green-100"
          icon="👷"
        />
        <StatCard
          title="Total Services"
          value="40"
          change="1.8% Up from yesterday"
          trend="up"
          iconBg="bg-red-100"
          icon="🔧"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Sales Details</h2>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Last 30 days</span>
          </div>
        </div>
        <div className="h-64 w-full">
          {/* This would be your actual chart component */}
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-400">Sales Chart Visualization</p>
          </div>
        </div>
      </div>

      {/* Top Services and Technicians */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Top Services</h2>
            <button className="text-xs text-blue-600">See All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2 font-medium">Service</th>
                  <th className="pb-2 font-medium">Booking</th>
                  <th className="pb-2 font-medium">Rating</th>
                  <th className="pb-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <TableRow service="AC Repair" booking="138" rating="4.8" revenue="$2.3k" />
                <TableRow service="Electrical" booking="125" rating="4.6" revenue="$1.8k" />
                <TableRow service="TV Repair" booking="112" rating="4.7" revenue="$1.6k" />
                <TableRow service="Plumbing" booking="98" rating="4.5" revenue="$1.4k" />
                <TableRow service="Painting" booking="87" rating="4.7" revenue="$1.2k" />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Top Technicians</h2>
            <button className="text-xs text-blue-600">See All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2 font-medium">Technician</th>
                  <th className="pb-2 font-medium">Jobs</th>
                  <th className="pb-2 font-medium">Rating</th>
                  <th className="pb-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <TableRow service="Aaron" booking="243" rating="4.8" revenue="$3.2k" />
                <TableRow service="Jacob" booking="198" rating="4.6" revenue="$2.8k" />
                <TableRow service="Ashish" booking="164" rating="4.7" revenue="$2.2k" />
                <TableRow service="John" booking="142" rating="4.5" revenue="$1.9k" />
                <TableRow service="Mark" booking="128" rating="4.7" revenue="$1.7k" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change, trend, iconBg, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold mb-2">{value}</h3>
          <div className="flex items-center text-xs">
            {trend === "up" ? (
              <TrendingUp size={14} className="text-green-500 mr-1" />
            ) : (
              <TrendingDown size={14} className="text-red-500 mr-1" />
            )}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{change}</span>
          </div>
        </div>
        <div className={`${iconBg} p-2 rounded-full`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  )
}

const TableRow = ({ service, booking, rating, revenue }) => {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3">{service}</td>
      <td className="py-3">{booking}</td>
      <td className="py-3">{rating}</td>
      <td className="py-3">{revenue}</td>
    </tr>
  )
}

export default DashboardContent
