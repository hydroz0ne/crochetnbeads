import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="333456998423-mtova3q2qf82ro8dbf5biscofttttkjm.apps.googleusercontent.com">
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </GoogleOAuthProvider>
);