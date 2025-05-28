import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="886412616750-2e36ghbok5t4vq9sl77m9nt8beap9c98.apps.googleusercontent.com">
      <StrictMode>
       
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        
      </StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);