import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../api';
import { setUser } from '../../store/userSlice';
import './Signup.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters long')
      .matches(/^[A-Za-z]+$/, 'First name must contain only letters'),
    lastName: Yup.string()
      .trim()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters long')
      .matches(/^[A-Za-z]+$/, 'Last name must contain only letters'),
    email: Yup.string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
        'Password must be at least 8 characters, include a capital letter, lowercase letter, number, and special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...dataToSend } = values; // Exclude confirmPassword
      const response = await api.post('/users/register/', dataToSend);

      // Store user details in Redux
      dispatch(setUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      }));

      // Show success toast
      toast.success(response.data.message || 'User registered. OTP sent to email.');

      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email: values.email } });
    } catch (err) {
      // Handle backend errors
      const errorMessage = err.response?.data?.message || 'Registration failed';
      if (err.response?.data && typeof err.response.data === 'object') {
        // Handle serializer errors (e.g., {"email": ["This field is required."]})
        Object.entries(err.response.data).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach((msg) => toast.error(`${field}: ${msg}`));
          } else {
            toast.error(`${field}: ${errors}`);
          }
        });
      } else {
        toast.error(errorMessage);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-box">
        <h2>Register to HomiGo</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="input-field"
                />
                <ErrorMessage name="firstName" component="span" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="input-field"
                />
                <ErrorMessage name="lastName" component="span" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="input-field"
                />
                <ErrorMessage name="email" component="span" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <Field
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="input-field"
                />
                <ErrorMessage name="phoneNumber" component="span" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="input-field"
                />
                <ErrorMessage name="password" component="span" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="input-field"
                />
                <ErrorMessage name="confirmPassword" component="span" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              <div className="link-text">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;