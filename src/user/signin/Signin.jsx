import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api';
import { setUser } from '../../store/userSlice';
import './Signin.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Spinner state

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await api.post('users/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { user } = response.data;
        console.log(user)
        const accessToken = response.data.access_token;

        localStorage.setItem('access_token', accessToken);

        dispatch(setUser({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role,
          isVerified: user.isVerified,
          status: user.status,
        }));


        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'technician') {
          navigate('/technician-home');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      if (errorMessage === 'Email is incorrect') {
        toast.error('Email is incorrect');
      } else if (errorMessage === 'Password is incorrect') {
        toast.error('Password is incorrect', { autoClose: 5000 });
      } else {
        toast.error(errorMessage, { autoClose: 5000 });
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('users/google-auth/', {
        credential: credentialResponse.credential,
        client_id: credentialResponse.clientId,
      });

      if (response.status === 200) {
        const { user, access_token: accessToken } = response.data;

        localStorage.setItem('access_token', accessToken);

        dispatch(setUser({
          email: user.email,
          role: user.role,
        }));

        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }

        toast.success('Logged in with Google successfully');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Google login failed';
      toast.error(errorMessage, { autoClose: 5000 });
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error('Google login failed', { autoClose: 5000 });
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1 className="logo">
          Homi<span className="logo-highlight">Go</span>
        </h1>
      </div>
      <div className="login-box">
        <h2>Sign In</h2>
        <p>Sign in to stay connected.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="login-btn flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="divider">
          <span>or sign in with other accounts?</span>
        </div>
        <div className="google-btn">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            theme="filled_black"
            text="signin_with"
          />
        </div>
        <p className="signup-link">
          Don’t have an account? <a href="/register">Click here to sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
