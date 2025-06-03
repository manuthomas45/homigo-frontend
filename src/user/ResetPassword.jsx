import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { toast } from 'react-toastify'; // Add toast for error/success messages
import { Lock, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import api from '../api'; // Import your API client

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(''); // Add state for token
  const navigate = useNavigate();
  const location = useLocation(); // Use location to get query params

  // Extract token from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Invalid reset link');
      navigate('/forgot-password');
    } else {
      setToken(tokenParam);
    }
  }, [location, navigate]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    return errors;
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ');
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        // Make API call to reset password
        const response = await api.post('/users/reset-password/', {
          token,
          new_password: newPassword,
        });
        setIsLoading(false);
        setIsUpdated(true);
        toast.success(response.data.message);
        // Clear any stored tokens (if applicable)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } catch (err) {
        setIsLoading(false);
        const errorMessage = err.response?.data?.detail || 'Failed to reset password. Please try again.';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    }
  };

  const passwordStrength = () => {
    const errors = validatePassword(newPassword);
    const strength = 4 - errors.length;
    const colors = {
      0: { bar: 'bg-red-500', text: 'text-red-600' },
      1: { bar: 'bg-orange-500', text: 'text-orange-600' },
      2: { bar: 'bg-yellow-500', text: 'text-yellow-600' },
      3: { bar: 'bg-green-500', text: 'text-green-600' },
      4: { bar: 'bg-green-500', text: 'text-green-600' }
    };
    return {
      score: strength,
      label: ['Weak', 'Fair', 'Good', 'Strong'][strength] || 'Weak',
      colors: colors[strength] || colors[0]
    };
  };

  if (!token) {
    return null; // Render nothing until token is validated
  }

  if (isUpdated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Updated!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now login with your new password.
            </p>
            <button
              onClick={() => navigate('/login')} // Use navigate instead of window.location
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const strength = newPassword ? passwordStrength() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HomiGo
          </h1>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600 text-sm">
              Enter your new password to reset your account
            </p>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Enter New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
              {newPassword && strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`font-medium ${strength.colors.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${strength.colors.bar} transition-all duration-300`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One number
                </li>
              </ul>
            </div>

            {/* Display general errors (e.g., token expired) */}
            {errors.general && (
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                'Update'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')} // Use navigate instead of window.location
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>© 2025 HomiGo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}