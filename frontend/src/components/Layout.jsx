import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white-800">
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
