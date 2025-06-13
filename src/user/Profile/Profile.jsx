import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../api';
import { setUser } from '../../store/userSlice';
import Navbar from '../Home/Navbar';
import Cropper from 'react-easy-crop';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me/');
        dispatch(setUser(response.data));
        setPreview(response.data.profilePicture || '');
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load profile');
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
    checkHasPassword();
  }, [dispatch]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPreview(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log('Cropped Area Pixels:', croppedAreaPixels);
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(setUser({ ...user, profilePicture: response.data.profilePicture }));
      setPreview(response.data.profilePicture);
      toast.success('Profile picture updated successfully');
      setIsModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

    if (!nameRegex.test(formData.firstName)) {
      toast.error('First name must contain only letters and be at least 2 characters');
      return false;
    }

    if (!nameRegex.test(formData.lastName)) {
      toast.error('Last name must contain only letters and be at least 2 characters');
      return false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }

    return true;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put('/users/me/', formData);
      dispatch(setUser({ ...user, ...response.data.user }));
      toast.success('Profile details updated successfully');
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

    if (hasPassword && !passwordData.currentPassword) {
      toast.error('Current password is required');
      return false;
    }

    if (!passwordRegex.test(passwordData.newPassword)) {
      toast.error(
        'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character'
      );
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = hasPassword
        ? {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword,
          }
        : {
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword,
          };

      await api.post('/users/change-password/', payload);
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Your Profile</h2>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative cursor-pointer" onClick={handleImageClick}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 border-4 border-gray-200">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Modal for Image Upload and Cropping */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Update Profile Picture</h3>
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
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
                        onCropChange={(crop) => {
                          console.log('Crop Change:', crop);
                          setCrop(crop);
                        }}
                        onZoomChange={(zoom) => {
                          console.log('Zoom Change:', zoom);
                          setZoom(zoom);
                        }}
                        onCropComplete={onCropComplete}
                        style={{
                          containerStyle: { position: 'relative', width: '100%', height: '100%' },
                          mediaStyle: { width: '100%', height: '100%' },
                          cropAreaStyle: { border: '2px solid #3b82f6' },
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zoom: {zoom.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handlePictureSubmit}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={isLoading || !selectedImage}
                  >
                    {isLoading ? 'Uploading...' : 'Update Profile Picture'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-full hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Details Form */}
          <form onSubmit={handleDetailsSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (Cannot be changed)
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 disabled:bg-green-300 mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-600 disabled:bg-yellow-300"
              disabled={isLoading}
            >
              Change Password
            </button>
          </form>

          {/* Modal for Password Change */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  {hasPassword && (
                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-full hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;