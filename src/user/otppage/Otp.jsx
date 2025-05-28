import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import api from '../../api'; // Use api.js instead of axios
import './Otp.css';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // Redirect to /register if email is missing
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(() => {
    // On initial load, check if a timer start time exists in localStorage
    const storedStartTime = localStorage.getItem('otpTimerStart');
    if (storedStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000);
      const initialTime = 120 - elapsedSeconds; // 2 minutes = 120 seconds
      return initialTime > 0 ? initialTime : 0;
    }
    // If no start time exists, set it and return 120 seconds
    localStorage.setItem('otpTimerStart', Date.now().toString());
    return 120;
  });
  const [isExpired, setIsExpired] = useState(timeLeft <= 0);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error('Email and OTP are required');
      return;
    }

    if (isExpired) {
      toast.error('OTP has expired. Please resend a new OTP.');
      return;
    }

    try {
      const response = await api.post('users/verify-otp/', { email, otp });

      // If OTP is verified successfully
      if (response.status === 200) {
        toast.success(response.data.message || 'OTP verified successfully');
        localStorage.removeItem('otpTimerStart'); // Clear timer on success
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      if (err.response?.data && typeof err.response.data === 'object') {
        Object.values(err.response.data).forEach((error) => {
          if (Array.isArray(error)) {
            error.forEach((msg) => toast.error(msg));
          } else {
            toast.error(error);
          }
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post('users/resend-otp/', { email });

      if (response.status === 200) {
        toast.success(response.data.message || 'New OTP sent to email.');
        setTimeLeft(120); // Reset timer to 2 minutes
        setIsExpired(false); // Allow verification again
        setOtp(''); // Clear the OTP input
        localStorage.setItem('otpTimerStart', Date.now().toString()); // Reset timer start time
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      if (err.response?.data && typeof err.response.data === 'object') {
        Object.values(err.response.data).forEach((error) => {
          if (Array.isArray(error)) {
            error.forEach((msg) => toast.error(msg));
          } else {
            toast.error(error);
          }
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="verify-otp-container">
      <h1 className="logo">
        Homi<span className="logo-highlight">Go</span>
      </h1>
      <div className="verify-otp-box">
        <h2>Verify OTP</h2>
        <p>
          {isExpired
            ? 'The OTP has expired. Please resend a new OTP to verify your account.'
            : `An OTP has been sent to ${email || 'your email'}. Please enter it below to verify your account.`}
        </p>
        {!isExpired && (
          <p className="timer">Time remaining: {formatTime(timeLeft)}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isExpired} // Disable input when OTP is expired
            />
          </div>
          {isExpired ? (
            <button type="button" className="resend-btn" onClick={handleResendOTP}>
              Resend OTP
            </button>
          ) : (
            <button type="submit" className="verify-btn">
              Verify
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;