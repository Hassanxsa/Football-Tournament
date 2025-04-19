import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="min-h-screen bg-black bg-opacity-50">
        {children}
      </div>
    </div>
  );
};

export default Layout;
