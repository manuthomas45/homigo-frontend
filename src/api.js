import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
});

// Flag to track if a refresh is in progress
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (
      config.url.includes('/users/register/') ||
      config.url.includes('/users/verify-otp/') ||
      config.url.includes('/users/resend-otp/') ||
      config.url.includes('/users/login/')
    ) {
      return config;
    }

    const accessToken = localStorage.getItem('access_token');
    console.log("access token from api.js", accessToken);
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error: Unable to connect to the server.'));
    }

    const originalRequest = error.config;
    console.log(originalRequest);
    

    if (
      originalRequest.url.includes('/users/register/') ||
      originalRequest.url.includes('/users/verify-otp/') ||
      originalRequest.url.includes('/users/resend-otp/') ||
      originalRequest.url.includes('/users/login/')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post('http://localhost:8000/refresh-token/', {}, { withCredentials: true });
        const newAccessToken = response.data.access_token;

        localStorage.setItem('access_token', newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        try {
          await axios.post('http://localhost:8000/users/logout/', {}, { withCredentials: true });
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
        }
        localStorage.removeItem('access_token');
        const refreshFailedEvent = new Event('token-refresh-failed');
        window.dispatchEvent(refreshFailedEvent);
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      console.error('403 Forbidden:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;