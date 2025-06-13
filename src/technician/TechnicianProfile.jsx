import { useState, useEffect } from "react";
import api from '../api';
import TechnicianNavbarSidebar from './TechnicianNavbarSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TechnicianProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  
  // Modal states
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Profile picture upload state
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Profile details form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch user and technician details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/technician/user-details/');
        setUserDetails(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
        });
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
      }
    };

    const fetchTechnicianDetails = async () => {
      try {
        const response = await api.get('/technician/details/');
        setTechnicianDetails(response.data);
      } catch (error) {
        console.error('Error fetching technician details:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
    fetchTechnicianDetails();
  }, []);

  // Handle profile picture selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      setSelectedImage(file);
    }
  };

  // Handle profile picture upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedImage);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await api.put('/technician/user-details/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUserDetails(response.data);
      setIsProfilePicModalOpen(false);
      setSelectedImage(null);
      toast.success("Profile picture updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error.response?.data || error.message);
      toast.error("Failed to update profile picture", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Validate form data before updating profile details
  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName || formData.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters long";
    } else if (!nameRegex.test(formData.firstName)) {
      errors.firstName = "First name must contain only letters";
    }

    if (!formData.lastName || formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "Last name must contain only letters";
    }

    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile details update
  const handleDetailsUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.put('/technician/user-details/', formData);
      setUserDetails(response.data);
      setIsDetailsModalOpen(false);
      setFormErrors({});
      toast.success("Profile details updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating profile details:', error.response?.data || error.message);
      const errors = error.response?.data || {};
      setFormErrors(errors);
      toast.error("Failed to update profile details", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <TechnicianNavbarSidebar>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

        {/* Tabs for Personal Info and Details */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveSection("personal")}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeSection === "personal"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveSection("details")}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeSection === "details"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Details
          </button>
        </div>

        {/* Content based on active section */}
        {activeSection === "personal" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            {userDetails ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="relative">
                    <img
                      src={userDetails.profilePicture || "https://via.placeholder.com/100"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover cursor-pointer"
                      onClick={() => {
                        console.log("Profile picture clicked");
                        setIsProfilePicModalOpen(true);
                        console.log("isProfilePicModalOpen set to:", true);
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white text-sm">Change</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">First Name:</span>{" "}
                      {userDetails.firstName || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Last Name:</span>{" "}
                      {userDetails.lastName || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone Number:</span>{" "}
                      {userDetails.phoneNumber || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {userDetails.email || "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
        )}

        {activeSection === "details" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Technician Details</h2>
            {technicianDetails ? (
              <div className="space-y-4">
                <div className="flex space-x-8">
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Aadhaar Number:</span>{" "}
                      {technicianDetails.aadhaar_number || "N/A"}
                    </p>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">Aadhaar Image:</p>
                      {technicianDetails.aadhaar_card_picture ? (
                        <img
                          src={technicianDetails.aadhaar_card_picture}
                          alt="Aadhaar"
                          className="w-48 h-48 object-cover rounded-md"
                        />
                      ) : (
                        <p className="text-gray-500">No Aadhaar image available</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Category:</span>{" "}
                      {technicianDetails.category || "N/A"}
                    </p>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">Certificate Image:</p>
                      {technicianDetails.certificate_picture ? (
                        <img
                          src={technicianDetails.certificate_picture}
                          alt="Certification"
                          className="w-48 h-48 object-cover rounded-md"
                        />
                      ) : (
                        <p className="text-gray-500">No certification image available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading technician details...</p>
            )}
          </div>
        )}
      </div>

      {/* Profile Picture Modal */}
      {isProfilePicModalOpen && (
        console.log("Rendering profile picture modal"),
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4 w-full"
            />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsProfilePicModalOpen(false);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Profile Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setFormErrors({});
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDetailsUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </TechnicianNavbarSidebar>
  );
};

export default TechnicianProfile;