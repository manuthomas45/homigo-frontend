import { useState, useEffect } from "react";
import NavbarSidebar from "./Navbar";
import api from "../api";
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    service_image: null,
  });
  const [nameError, setNameError] = useState(''); // State for name validation error

  // Fetch service categories on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/adminpanel/service-categories/');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error.response?.status, error.response?.data || error.message);
      toast.error('Failed to load services');
      setLoading(false);
      setServices([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate name field
    if (name === 'name') {
      const lettersOnly = /^[A-Za-z]+$/;
      if (!value) {
        setNameError('Name is required');
      } else if (value.length < 2) {
        setNameError('Name must be at least 2 characters long');
      } else if (!lettersOnly.test(value)) {
        setNameError('Name must contain only letters');
      } else {
        setNameError('');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      service_image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const lettersOnly = /^[A-Za-z]+$/;
    if (!formData.name) {
      setNameError('Name is required');
      return;
    }
    if (formData.name.length < 2) {
      setNameError('Name must be at least 2 characters long');
      return;
    }
    if (!lettersOnly.test(formData.name)) {
      setNameError('Name must contain only letters');
      return;
    }

    // Validate image
    if (!formData.service_image) {
      toast.error('Please select an image for the service category');
      return;
    }

    // Since we're not uploading images directly to Cloudinary here, we'll just send the name
    // In a real app, you'd upload the image to Cloudinary first and get the public ID
    const dataToSend = {
      name: formData.name,
      service_image: null, // Set to null for now; update this if you implement Cloudinary upload
    };

    try {
      await api.post('/adminpanel/service-categories/', dataToSend);
      toast.success('Service category added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', service_image: null });
      setNameError('');
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error('Error adding service category:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.name
        ? error.response.data.name.join(', ') // Handle specific field errors
        : error.response?.data?.error || 'Failed to add service category';
      toast.error(errorMessage);
    }
  };

  return (<>
    <NavbarSidebar/>
      <div className="p-8 mt-14 md:ml-64">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Services</h1>
        {/* Add Service Category Button */}
        <div className="flex justify-end mb-6">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Service Category
          </button>
        </div>

        {/* Render Logic */}
        {loading ? (
          <p className="text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500">No service categories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
              >
                {service.service_image ? (
                  <img
                    src={service.service_image}
                    alt={service.name}
                    className="w-32 h-32 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Service Category</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      nameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-red-500">{nameError}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="service_image" className="block text-sm font-medium text-gray-700">
                    Image (Required)
                  </label>
                  <input
                    type="file"
                    id="service_image"
                    name="service_image"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    required
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    // Note: Image upload requires Cloudinary integration (not implemented here).
                  </p> */}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ name: '', service_image: null });
                      setNameError('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Services;