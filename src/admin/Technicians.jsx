import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../api';
import NavbarSidebar from './Navbar';

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async (query = '') => {
    try {
      setLoading(true);
      const response = await api.get('/adminpanel/technicians/', {
        params: { search: query }
      });
      console.log('Fetch Technicians Response:', response.data);
      if (response.data.success) {
        setTechnicians(response.data.technicians);
      } else {
        toast.error('Failed to fetch technicians');
      }
    } catch (error) {
      console.error('Fetch Technicians Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTechnicians(searchQuery);
  };

  const fetchTechnicianDetails = async (userId) => {
    try {
      const response = await api.get(`/adminpanel/technicians/${userId}/`);
      console.log('Technician Details Response:', response.data);
      if (response.data.success) {
        setSelectedTechnician(response.data.technician);
        setIsModalOpen(true);
      } else {
        toast.error('Failed to fetch technician details');
      }
    } catch (error) {
      console.error('Fetch Technician Details Error:', error.response?.data || error.message);
      toast.error('An error occurred while fetching technician details');
    }
  };

  const toggleVerifyTechnician = async (userId) => {
    const action = selectedTechnician.is_verified ? 'unverify' : 'verify';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this technician?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action}!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await api.patch(`/adminpanel/technicians/${userId}/`);
        console.log('Toggle Verify Response:', response.data);
        if (response.data.success) {
          setSelectedTechnician(response.data.technician);
          Swal.fire({
            title: 'Success!',
            text: `Technician has been ${action === 'verify' ? 'verified' : 'unverified'}.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          toast.error('Failed to update verification status');
        }
      } catch (error) {
        console.error('Toggle Verify Error:', error.response?.data || error.message);
        toast.error('An error occurred while updating verification status');
      }
    }
  };

  const toggleBlockTechnician = async (userId) => {
    const action = selectedTechnician.status === 'blocked' ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this technician?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action}!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post(`/adminpanel/technicians/${userId}/`);
        console.log('Toggle Block Response:', response.data);
        if (response.data.success) {
          setSelectedTechnician(response.data.technician);
          Swal.fire({
            title: 'Success!',
            text: `Technician has been ${action === 'block' ? 'blocked' : 'unblocked'}.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          toast.error('Failed to update block status');
        }
      } catch (error) {
        console.error('Toggle Block Error:', error.response?.data || error.message);
        toast.error('An error occurred while updating block status');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTechnician(null);
    setEnlargedImage(null);
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <>
      <NavbarSidebar />
      <div className="pt-[72px] md:pl-64 p-12">
        <h1 className="text-2xl font-bold mb-6">Technicians</h1>

        {/* Search Box */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search technicians..."
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

        {/* Technicians Table */}
        {loading ? (
          <p>Loading technicians...</p>
        ) : technicians.length === 0 ? (
          <p>No technicians found</p>
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
                {technicians.map((technician) => (
                  <tr key={technician.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{technician.id}</td>
                    <td className="py-3 px-4">{technician.firstName}</td>
                    <td className="py-3 px-4">{technician.lastName}</td>
                    <td className="py-3 px-4">{technician.email}</td>
                    <td className="py-3 px-4">{technician.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => fetchTechnicianDetails(technician.id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Technician Details */}
        {isModalOpen && selectedTechnician && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Technician Details</h2>
              <div className="space-y-4">
                {/* First Line: Category and Aadhaar Number */}
                <div className="flex items-center gap-4">
                  <p className="flex-1">
                    <strong>Category:</strong> {selectedTechnician.category}
                  </p>
                  <p className="flex-1">
                    <strong>Aadhaar Number:</strong> {selectedTechnician.aadhaar_number}
                  </p>
                </div>

                {/* Second Line: Wallet and City */}
                <div className="flex items-center gap-4">
                  <p className="flex-1">
                    <strong>Wallet:</strong> ${selectedTechnician.wallet.toFixed(2)}
                  </p>
                  <p className="flex-1">
                    <strong>City:</strong> {selectedTechnician.city}
                  </p>
                </div>

                {/* Third Line: Images */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <strong>Aadhaar Card Picture:</strong>
                    {selectedTechnician.aadhaar_card_picture ? (
                      <img
                        src={selectedTechnician.aadhaar_card_picture}
                        alt="Aadhaar Card"
                        className="mt-2 h-40 w-full object-contain rounded cursor-pointer"
                        onError={(e) => console.error('Failed to load Aadhaar image:', e)}
                        onClick={() => handleImageClick(selectedTechnician.aadhaar_card_picture)}
                      />
                    ) : (
                      <p className="text-gray-500 mt-2">No Aadhaar card uploaded</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <strong>Certificate Picture:</strong>
                    {selectedTechnician.certificate_picture ? (
                      <img
                        src={selectedTechnician.certificate_picture}
                        alt="Certificate"
                        className="mt-2 h-40 w-full object-contain rounded cursor-pointer"
                        onError={(e) => console.error('Failed to load Certificate image:', e)}
                        onClick={() => handleImageClick(selectedTechnician.certificate_picture)}
                      />
                    ) : (
                      <p className="text-gray-500 mt-2">No certificate uploaded</p>
                    )}
                  </div>
                </div>

                {/* Fourth Line: Status */}
                <div className="flex items-center gap-4">
                  <p className="flex-1">
                    <strong>Status:</strong> {selectedTechnician.status}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className={`px-4 py-2 ${
                    selectedTechnician.is_verified
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white rounded-lg`}
                  onClick={() => toggleVerifyTechnician(selectedTechnician.user.id)}
                >
                  {selectedTechnician.is_verified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  className={`px-4 py-2 ${
                    selectedTechnician.status === 'blocked'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white rounded-lg`}
                  onClick={() => toggleBlockTechnician(selectedTechnician.user.id)}
                >
                  {selectedTechnician.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enlarged Image Modal */}
        {enlargedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg p-6 w-[672px] h-[500px] flex items-center justify-center">
              <img
                src={enlargedImage}
                alt="Enlarged"
                className="max-w-[600px] max-h-[420px] object-contain rounded"
                onError={(e) => console.error('Failed to load enlarged image:', e)}
              />
              <button
                className="absolute top-2 right-2 bg-white text-black rounded-full p-2 hover:bg-gray-200 text-lg font-bold z-[60]"
                onClick={closeEnlargedImage}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Technicians;