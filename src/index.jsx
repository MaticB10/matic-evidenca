import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Login from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
