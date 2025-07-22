import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../api';
import { setUser } from '../../store/userSlice';
import Navbar from '../Home/Navbar';
import Cropper from 'react-easy-crop';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'; // Updated MUI imports

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // New state for update modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone_number: '',
    is_default: false,
  });
  const [selectedAddress, setSelectedAddress] = useState(null); // New state for selected address
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // New state for delete confirmation
  const [addressToDelete, setAddressToDelete] = useState(null); // Track address to delete
  console.log("current user", user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me/');
        dispatch(setUser(response.data));
        setPreview(response.data.profilePicture || '');
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load profile');
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/users/addresses/`);
        setAddresses(response.data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        // toast.error('Failed to load addresses');
      }
    };

    const checkHasPassword = async () => {
      try {
        const response = await api.get('/users/has-password/');
        setHasPassword(response.data.hasPassword);
      } catch (error) {
        console.error('Failed to check password status:', error);
        toast.error('Failed to check password status');
      }
    };

    fetchUserProfile();
    fetchAddresses();
    checkHasPassword();
  }, [dispatch]);

  const handleImageClick = () => setIsImageModalOpen(true);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPreview(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage || !croppedAreaPixels) {
      toast.error('Please select and crop an image');
      return;
    }

    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append('profilePicture', croppedImage);

      const response = await api.post('/users/update-profile-picture/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(setUser({ ...user, profilePicture: response.data.profilePicture }));
      setPreview(response.data.profilePicture);
      toast.success('Profile picture updated');
      setIsImageModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    setPreview(user?.profilePicture || '');
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfileForm = () => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    if (!nameRegex.test(formData.firstName)) return false;
    if (!nameRegex.test(formData.lastName)) return false;
    if (!phoneRegex.test(formData.phoneNumber)) return false;
    return true;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;
    setIsLoading(true);
    try {
      const response = await api.put('/users/me/', formData);
      dispatch(setUser({ ...user, ...response.data.user }));
      toast.success('Profile details updated');
    } catch (error) {
      console.error('Failed to update profile details:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (hasPassword && !passwordData.currentPassword) return false;
    if (!passwordRegex.test(passwordData.newPassword)) return false;
    if (passwordData.newPassword !== passwordData.confirmPassword) return false;
    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setIsLoading(true);
    try {
      const payload = hasPassword
        ? { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword, confirmPassword: passwordData.confirmPassword }
        : { newPassword: passwordData.newPassword, confirmPassword: passwordData.confirmPassword };
      await api.post('/users/change-password/', payload);
      toast.success('Password updated');
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(`/users/addresses/`, addressForm);
      setAddresses([...addresses, response.data]);
      toast.success('Address added successfully');
      setIsAddressModalOpen(false);
      setAddressForm({ address: '', city: '', state: '', pincode: '', phone_number: '', is_default: false });
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressUpdate = async (address) => {
    setSelectedAddress(address);
    setAddressForm({
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone_number: address.phone_number,
      is_default: address.is_default,
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddressUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) return;

    setIsLoading(true);
    try {
      const response = await api.put(`/users/addresses/${selectedAddress.id}/`, addressForm);
      setAddresses(addresses.map((addr) => (addr.id === selectedAddress.id ? response.data : addr)));
      toast.success('Address updated successfully');
      setIsUpdateModalOpen(false);
      setSelectedAddress(null);
      setAddressForm({ address: '', city: '', state: '', pincode: '', phone_number: '', is_default: false });
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressDelete = async () => {
    if (!addressToDelete) return;

    setIsLoading(true);
    try {
      await api.delete(`/users/addresses/${addressToDelete}/`);
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setIsLoading(true);
    try {
      await api.patch(`/users/addresses/${addressId}/set_default/`, { is_default: true });
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        is_default: addr.id === addressId,
      }));
      setAddresses(updatedAddresses);
      toast.success('Address set as default');
    } catch (error) {
      console.error('Failed to set default address:', error);
      toast.error('Failed to set default address');
    } finally {
      setIsLoading(false);
    }
  };

  // Update button text based on is_default status
  const getDefaultButtonText = (isDefault) => (isDefault ? 'Default' : 'Set as Default');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">User Profile</h1>

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative cursor-pointer" onClick={handleImageClick}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-gray-200">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Update Profile Picture</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                  />
                  {selectedImage && (
                    <>
                      <div className="relative w-full h-64 mb-4">
                        <Cropper
                          image={selectedImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={false}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          style={{
                            containerStyle: { width: '100%', height: '100%' },
                            mediaStyle: { width: '100%', height: '100%' },
                            cropAreaStyle: { border: '2px solid #3b82f6' },
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full mb-4"
                      />
                    </>
                  )}
                  <div className="flex gap-4">
                    <button
                      onClick={handlePictureSubmit}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                      disabled={isLoading || !selectedImage}
                    >
                      {isLoading ? 'Uploading...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Details */}
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>

            {/* Addresses Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Addresses</h2>
              {addresses.length === 0 ? (
                <p className="text-gray-500">No addresses added yet.</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg border border-gray-200 flex justify-between items-start ${address.is_default ? 'bg-green-100' : 'bg-gray-50'}`}
                    >
                      <div>
                        <p className="text-sm text-gray-700">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                        <p className="text-sm text-gray-600">Phone: {address.phone_number}</p>
                        <p className="text-sm text-gray-600">
                          {address.is_default ? 'Default Address' : ''}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddressUpdate(address)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setAddressToDelete(address.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className={`px-3 py-1 ${address.is_default ? 'bg-gray-400' : 'bg-green-600'} text-white rounded-lg hover:${address.is_default ? 'bg-gray-500' : 'bg-green-700'} text-sm`}
                        >
                          {getDefaultButtonText(address.is_default)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Address
              </button>
            </div>

            {/* Password Change Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400"
                disabled={isLoading}
              >
                Change Password
              </button>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={addressForm.address}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={addressForm.phone_number}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      {/* <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressInputChange}
                          className="mr-2"
                        />
                        Set as Default
                      </label> */}
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Save Address'}
                      </button>
                      <button
                        onClick={() => setIsAddressModalOpen(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Update Address Modal */}
            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Update Address</h3>
                  <form onSubmit={handleAddressUpdateSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={addressForm.address}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={addressForm.phone_number}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      {/* <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressInputChange}
                          className="mr-2"
                        />
                        Set as Default
                      </label> */}
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsUpdateModalOpen(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Password Modal */}
            {isPasswordModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {hasPassword && (
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Save Password'}
                      </button>
                      <button
                        onClick={handlePasswordCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this address?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAddressDelete} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;