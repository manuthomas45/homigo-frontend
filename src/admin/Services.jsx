import { useState, useEffect } from "react";
import NavbarSidebar from "./Navbar";
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { fetchServices, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../api/servicesapi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    service_image: null,
  });
  const [nameError, setNameError] = useState(''); // State for name validation error

  // Fetch service categories on component mount
  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
      setLoading(false);
    } catch (error) {
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
      const lettersOnly = /^[A-Za-z\s]+$/; // Allow spaces
      if (!value) {
        setNameError('Name is required');
      } else if (value.trim().length < 2) {
        setNameError('Name must be at least 2 characters long');
      } else if (!lettersOnly.test(value)) {
        setNameError('Name must contain only letters and spaces');
      } else {
        setNameError('');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        e.target.value = ''; // Clear the input
        return;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      service_image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const lettersOnly = /^[A-Za-z\s]+$/; // Allow spaces in names
    if (!formData.name) {
      setNameError('Name is required');
      return;
    }
    if (formData.name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    if (!lettersOnly.test(formData.name.trim())) {
      setNameError('Name must contain only letters and spaces');
      return;
    }

    // For adding new category, image is required
    if (!selectedId && !formData.service_image) {
      toast.error('Please select an image');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name.trim());

    // Only append image if one is selected
    if (formData.service_image) {
      form.append('service_image', formData.service_image);
    }

    try {
      let response;
      if (selectedId) {
        // Update existing category
        response = await updateServiceCategory(selectedId, form);
        toast.success('Service category updated successfully');
      } else {
        // Add new category
        response = await createServiceCategory(form);
        toast.success('Service category added successfully');
      }

      // Reset form and close modal
      setIsModalOpen(false);
      setFormData({ name: '', service_image: null });
      setSelectedId(null);
      setNameError('');
      
      // Clear file input
      const fileInput = document.getElementById('service_image');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh the list
      fetchServicesData();
      
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      
      // More specific error handling
      if (err.response?.status === 400) {
        // Handle validation errors
        const errors = err.response.data;
        if (errors.name) {
          setNameError(errors.name[0]);
        } else {
          toast.error('Validation error: Please check your input');
        }
      } else if (err.response?.status === 401) {
        toast.error('Authentication required. Please login again.');
      } else if (err.response?.status === 403) {
        toast.error('Permission denied. Admin access required.');
      } else {
        toast.error(`Failed to save service category: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: '', service_image: null });
    setSelectedId(null);
    setNameError('');
    
    // Clear file input
    const fileInput = document.getElementById('service_image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleUpdateClick = (service) => {
    setFormData({
      name: service.name,
      service_image: null, // You may allow uploading new image if needed
    });
    setSelectedId(service.id);     // Store the ID to indicate it's update mode
    setIsModalOpen(true);          // Open the modal
  };

  return (<>
    <NavbarSidebar />
    <div className="p-8 mt-14 md:ml-64">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Services</h1>
      {/* Add Service Category Button */}
      <div className="flex justify-end mb-6">
        <button
  className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors shadow-md"
  style={{ width: 'fit-content' }}
  onClick={() => {
    // Reset form before opening modal for adding
    setFormData({ name: '', service_image: null });
    setSelectedId(null);
    setNameError('');
    
    // Clear file input if it exists
    const fileInput = document.getElementById('service_image');
    if (fileInput) {
      fileInput.value = '';
    }

    setIsModalOpen(true);
  }}
>
  + Add Category
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
              className="relative bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
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
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDeleteClick(service.id)}
                  className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateClick(service)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedId ? 'Update Service Category' : 'Add New Service Category'}
            </h2>
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-500">{nameError}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="service_image" className="block text-sm font-medium text-gray-700">
                  Image {selectedId ? '(Optional)' : '(Required)'}
                </label>
                <input
                  type="file"
                  id="service_image"
                  name="service_image"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  required={!selectedId}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {selectedId ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await deleteServiceCategory(selectedId);
                toast.success("Service category deleted");
                fetchServicesData();
              } catch (error) {
                toast.error("Failed to delete service category");
              } finally {
                setOpenDialog(false);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
  );
};

export default Services;