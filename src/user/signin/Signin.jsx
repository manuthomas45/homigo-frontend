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
    }
  };

  // Handle Google login success
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

  // Handle Google login failure
  const handleGoogleLoginFailure = () => {
    toast.error('Google login failed', { autoClose: 5000 });
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1 className="logo">
          Homi<span className="logo-highlight">Go</span>
        </h1>
        {/* <Link to="/technician-login" className="technician-portal">
          Technician Portal
          <span className="arrow">→</span>
        </Link> */}
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