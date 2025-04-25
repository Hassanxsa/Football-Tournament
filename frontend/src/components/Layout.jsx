import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Only show navbar if user is authenticated or if not on auth pages
  const showNavbar = !isAuthPage || isAuthenticated;
  
  return (
    <div className="min-h-screen bg-white-800">
      <div className="min-h-screen">
        {showNavbar && <Navbar />}
        {children}
      </div>
    </div>
  );
};

export default Layout;
