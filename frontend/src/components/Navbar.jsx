import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PlayerRequestDialog from './PlayerRequestDialog';

const Navbar = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playerRequestSent, setPlayerRequestSent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlayerRequestDialog, setShowPlayerRequestDialog] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    // Get current user ID from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
        
        // Check if player request has been sent for this specific user
        const requestStatus = localStorage.getItem(`playerRequestSent-${userId}`) === 'true';
        setPlayerRequestSent(requestStatus);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handlePlayerRequest = () => {
    // Show the player request dialog
    setShowPlayerRequestDialog(true);
  };
  

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Soccer@KFUPM</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/home"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/home')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/tournaments"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/tournaments')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Tournaments
                </Link>
                
                <Link
                  to="/teams"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/teams')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Teams
                </Link>
                
                <Link
                  to="/players"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/players')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Players
                </Link>
                
                <Link
                  to="/venues"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/venues')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Venues
                </Link>
                
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin')
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated && (
                <button 
                  onClick={handlePlayerRequest}
                  disabled={playerRequestSent}
                  className={`mr-4 px-3 py-1 rounded-md text-sm font-medium ${playerRequestSent 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {playerRequestSent ? 'Player Request Sent' : 'Request to be a Player'}
                </button>
              )}
              
          
              
              <button className="bg-blue-700 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="max-w-xs bg-blue-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium">U</span>
                    </div>
                  </button>
                </div>
                
                {showDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {!playerRequestSent && isAuthenticated && (
                      <button
                        onClick={handlePlayerRequest}
                        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Become a Player
                      </button>
                    )}
                    
                    {/* Manager/Coach button removed as requested */}
                    
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign in
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-900">
            Home
          </Link>
          <Link to="/tournaments" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700">
            Tournaments
          </Link>
          <Link to="/teams" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700">
            Teams
          </Link>
          <Link to="/players" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700">
            Players
          </Link>
          <Link to="/venues" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700">
            Venues
          </Link>
          <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700">
            Admin
          </Link>
        </div>
      </div>
      
      {/* Player Request Dialog */}
      <PlayerRequestDialog 
        isOpen={showPlayerRequestDialog} 
        onClose={() => setShowPlayerRequestDialog(false)} 
      />
      
      {/* Role Selection Dialog */}

    </nav>
  );
};

export default Navbar;
