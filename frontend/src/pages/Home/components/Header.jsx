import React from 'react';

const Header = () => {
  return (
    <div className="bg-blue-600 text-white py-8 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 flex items-center justify-center">
           KFUPM Soccer Tournaments
        </h1>
        <p className="text-lg sm:text-xl opacity-90 text-center">
          Your comprehensive platform for managing and exploring KFUPM football tournaments
        </p>
      </div>
    </div>
  );
};

export default Header;
