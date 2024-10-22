// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
    
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to retrieve data from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const login = (data) => {
    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };
  
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // vrne true, če token obstaja
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
