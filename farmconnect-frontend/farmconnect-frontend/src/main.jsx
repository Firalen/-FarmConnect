import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import i18n from './i18n/index.jsx';
import { AuthProvider } from './context/AuthContext';
import { I18nextProvider } from 'react-i18next';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
); 