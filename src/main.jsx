import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './store'; 
import { PersistGate } from 'redux-persist/integration/react'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> 
      <GoogleOAuthProvider clientId="886412616750-2e36ghbok5t4vq9sl77m9nt8beap9c98.apps.googleusercontent.com">
        <StrictMode>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </StrictMode>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
