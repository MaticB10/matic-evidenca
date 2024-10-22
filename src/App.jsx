// App.jsx
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LayoutsPage from './components/LayoutsPage';
import Calendar from './components/Koledar';
import Rezervacija from './components/Rezervacija';
import Graphs from './components/Grafi_Dela';
import Shramba from './components/Shramba';
import ChangePassword from './components/ChangePassword';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './contexts/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/App.css';

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log(`Authentication status changed: ${user ? 'authenticated' : 'unauthenticated'}`);
  }, [user]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {user ? (
            <>
              <Sidebar />
              <div className="main-content">
                <Header />
                <div className="content-area">
                  <Routes>
                    <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
                    <Route path="/layouts" element={<ProtectedRoute element={LayoutsPage} />} />
                    <Route path="/calendar" element={<ProtectedRoute element={Calendar} />} />
                    <Route path="/dela" element={<ProtectedRoute element={Rezervacija} />} />
                    <Route path="/graphs" element={<ProtectedRoute element={Graphs} />} />
                    <Route path="/shramba" element={<ProtectedRoute element={Shramba} />} />
                    <Route path="/changepassword" element={<ProtectedRoute element={ChangePassword} />} />
                  </Routes>
                </div>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
