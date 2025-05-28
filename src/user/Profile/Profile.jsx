import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../api';
import { setUser } from '../../store/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
    fetchUserProfile();
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      toast.error('Please select an image to upload');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await api.post('/users/update-profile-picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setUser({ ...user, profilePicture: response.data.profilePicture }));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/users/me/', formData);
      dispatch(setUser({ ...user, ...response.data.user }));
      toast.success('Profile details updated successfully');
    } catch (error) {
      console.error('Failed to update profile details:', error);
      toast.error('Failed to update profile details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Your Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
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
          <form onSubmit={handlePictureSubmit} className="mt-4">
            <label className="block">
              <span className="sr-only">Choose profile picture</span>
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
                disabled={isLoading}
              />
            </label>
            <button
              type="submit"
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Profile Picture'}
            </button>
          </form>
        </div>

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
            className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;