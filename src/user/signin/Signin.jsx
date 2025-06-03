import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import api from '../../api'; // Use api.js instead of axios
import { setUser } from '../../store/userSlice';
import './Signin.css';
import { Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('users/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { user } = response.data;
        const accessToken = response.data.access_token;

        // Store access token in localStorage
        localStorage.setItem('access_token', accessToken);

        // Store user details in Redux
        dispatch(setUser({
          email: user.email,
          role: user.role,
        }));

        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // Send the Google credential (ID token) to your backend
      const response = await api.post('users/google-auth/', {
        credential: credentialResponse.credential, // The ID token from Google
        client_id: credentialResponse.clientId,
      });

      if (response.status === 200) {
        const { user, access_token: accessToken } = response.data;

        // Store access token in localStorage
        localStorage.setItem('access_token', accessToken);

        // Store user details in Redux
        dispatch(setUser({
          email: user.email,
          role: user.role,
        }));

        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }

        toast.success('Logged in with Google successfully');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Google login failed';
      toast.error(errorMessage);
    }
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = () => {
    toast.error('Google login failed');
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1 className="logo">
          Homi<span className="logo-highlight">Go</span>
        </h1>
        <a href="#" className="technician-portal">
          Technician Portal
          <span className="arrow">→</span>
        </a>
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
          <div className="remember-me">
            {/* <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> */}
            {/* <label htmlFor="remember-me">Remember me?</label> */}
          </div>
          <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>         
            </div>
          <button type="submit" className="login-btn">Sign In</button>
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