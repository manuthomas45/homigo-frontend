import { useState, useEffect } from "react";
import NavbarSidebar from "./Navbar";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { FaWrench } from "react-icons/fa";
import {
  fetchServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} from "../api/serviceTypesApi";
import { fetchServices } from "../api/servicesapi";

const ServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    rate: "",
    description: "",
    image: null,
  });
  const [nameError, setNameError] = useState("");

  // Fetch service types and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, categoriesData] = await Promise.all([
          fetchServiceTypes(),
          fetchServices(),
        ]);
        setServiceTypes(typesData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        toast.error("Failed to load data");
        setServiceTypes([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const lettersOnly = /^[A-Za-z\s]+$/;
      if (!value) {
        setNameError("Name is required");
      } else if (value.trim().length < 2) {
        setNameError("Name must be at least 2 characters long");
      } else if (!lettersOnly.test(value)) {
        setNameError("Name must contain only letters and spaces");
      } else {
        setNameError("");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or GIF)");
        e.target.value = "";
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        e.target.value = "";
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

// Replace your existing handleSubmit function with this fixed version:

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation logic remains the same
  const lettersOnly = /^[A-Za-z\s]+$/;
  if (!formData.name) {
    setNameError("Name is required");
    return;
  }
  if (formData.name.trim().length < 2) {
    setNameError("Name must be at least 2 characters long");
    return;
  }
  if (!lettersOnly.test(formData.name.trim())) {
    setNameError("Name must contain only letters and spaces");
    return;
  }
  if (!formData.category) {
    toast.error("Category is required");
    return;
  }
  if (isNaN(formData.rate) || formData.rate <= 0) {
    toast.error("Rate must be a positive number");
    return;
  }

  const form = new FormData();
  form.append("category", formData.category);
  form.append("name", formData.name.trim());
  form.append("rate", formData.rate);
  form.append("description", formData.description || "");
  if (formData.image) {
    form.append("image", formData.image);
  }

  try {
    let response;
    if (selectedId) {
      // Update existing service type
      response = await updateServiceType(selectedId, form);
      console.log("Update response:", response);
      
      if (response.status === 200 && response.data && response.data.id) {
        toast.success("Service type updated successfully");
        setServiceTypes((prev) =>
          prev.map((item) => (item.id === selectedId ? response.data : item))
        );
      } else {
        throw new Error("Invalid response format from update");
      }
    } else {
      // Create new service type
      response = await createServiceType(form);
      console.log("Create response:", response);
      
      if (response.status === 201 && response.data && response.data.id) {
        toast.success("Service type added successfully");
        setServiceTypes((prev) => [...prev, response.data]);
      } else {
        throw new Error("Invalid response format from create");
      }
    }

    // Reset form on success
    setIsModalOpen(false);
    setFormData({ category: "", name: "", rate: "", description: "", image: null });
    setSelectedId(null);
    setNameError("");

    const fileInput = document.getElementById("service_type_image");
    if (fileInput) fileInput.value = "";

  } catch (err) {
    console.error("Error details:", err);
    
    // Handle different types of errors
    if (err.response?.status === 400) {
      const errors = err.response.data;
      console.log("Validation errors:", errors);
      
      if (errors.name && Array.isArray(errors.name)) {
        setNameError(errors.name[0]);
      } else if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
        toast.error(errors.non_field_errors[0]);
      } else if (typeof errors === 'object') {
        // Handle other validation errors
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorMessage = Array.isArray(errors[firstErrorKey]) 
          ? errors[firstErrorKey][0] 
          : errors[firstErrorKey];
        toast.error(firstErrorMessage || "Validation error occurred");
      } else {
        toast.error("Please provide valid data");
      }
    } else if (err.response?.status === 500) {
      toast.error("Server error occurred. Please try again later.");
    } else {
      // Handle network errors or other issues
      toast.error(err.message || "Failed to save service type");
    }
  }
};

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ category: "", name: "", rate: "", description: "", image: null });
    setSelectedId(null);
    setNameError("");

    const fileInput = document.getElementById("service_type_image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleUpdateClick = (serviceType) => {
    setFormData({
      category: serviceType.category || "",
      name: serviceType.name || "",
      rate: serviceType.rate || "",
      description: serviceType.description || "",
      image: null,
    });
    setSelectedId(serviceType.id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedId) throw new Error("No service type selected for deletion");
      await deleteServiceType(selectedId);
      toast.success("Service type deleted");
      setServiceTypes((prev) => prev.filter((item) => item.id !== selectedId));
      setOpenDialog(false);
    } catch (error) {
      toast.error("Failed to delete service type: " + (error.response?.data?.error || error.message));
      setOpenDialog(false);
    }
  };
return (
  <>
    <NavbarSidebar />
    <div className="p-8 mt-14 md:ml-64">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Types</h1>
      <div className="flex justify-end mb-6">
        <button
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors shadow-md"
          style={{ width: "fit-content" }}
          onClick={() => {
            setFormData({ category: "", name: "", rate: "", description: "", image: null });
            setSelectedId(null);
            setNameError("");
            const fileInput = document.getElementById("service_type_image");
            if (fileInput) {
              fileInput.value = "";
            }
            setIsModalOpen(true);
          }}
        >
          + Add Service Type
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading service types...</p>
      ) : serviceTypes.length === 0 ? (
        <p className="text-gray-500">No service types found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {serviceTypes.map((serviceType) => (
            <div
              key={serviceType.id}
              className="relative bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              {serviceType.image ? (
                <img
                  src={serviceType.image}
                  alt={serviceType.name}
                  className="w-32 h-32 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800">{serviceType.name}</h3>
              <p className="text-sm text-gray-600">Rate: ₹{serviceType.rate}</p>
              <p className="text-sm text-gray-600 mt-1">{serviceType.description || "No description"}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDeleteClick(serviceType.id)}
                  className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
                  <button
                    onClick={() => handleUpdateClick(serviceType)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {selectedId ? "Update Service Type" : "Add New Service Type"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {categories.length === 0 ? (
                      <option value="">No category available</option>
                    ) : (
                      <>
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
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
                      nameError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="service_type_image" className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    id="service_type_image"
                    name="image"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
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
                    {selectedId ? "Update Service Type" : "Add Service Type"}
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
              Are you sure you want to delete this service type?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
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

export default ServiceTypes;