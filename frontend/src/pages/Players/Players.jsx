import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playerService } from '../../services/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const searchParams = {};
        
        if (searchTerm) {
          searchParams.search = searchTerm;
        }
        
        if (filterPosition !== 'all') {
          searchParams.position = filterPosition;
        }
        
        // Get players with their stats
        const data = await playerService.getAllPlayers(searchParams);
        
        // Get goal stats for each player
        const playersWithGoals = await Promise.all(data.map(async (player) => {
          try {
            const stats = await playerService.getPlayerStats(player.player_id);
            return {
              ...player,
              goals: stats.goals || 0
            };
          } catch (err) {
            console.error(`Error fetching stats for player ${player.player_id}:`, err);
            return {
              ...player,
              goals: 0
            };
          }
        }));
        
        // Sort players by goals (highest first)
        const sortedPlayers = playersWithGoals.sort((a, b) => b.goals - a.goals);
        
        setPlayers(sortedPlayers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load players');
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [searchTerm, filterPosition]);

  // Playing positions
  const positions = [
    { position_id: 'GK', position_desc: 'Goalkeepers' },
    { position_id: 'DF', position_desc: 'Defenders' },
    { position_id: 'MF', position_desc: 'Midfielders' },
    { position_id: 'FD', position_desc: 'Forwards' }
  ];

  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePositionChange = (e) => {
    setFilterPosition(e.target.value);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/home" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
      
      {/* Players Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Players Directory</h1>
          <p className="text-blue-200">Browse all players participating in tournaments</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Players
              </label>
              <input
                type="text"
                id="search"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div>
              <label htmlFor="position-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Position
              </label>
              <select
                id="position-filter"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={filterPosition}
                onChange={handlePositionChange}
              >
                <option value="all">All Positions</option>
                {positions.map(position => (
                  <option key={position.position_id} value={position.position_id}>
                    {position.position_desc}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <span className="text-sm text-gray-500">
                Showing {players.length} players
              </span>
            </div>
          </div>
        </div>
        
        {/* Players Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600">Loading players...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map(player => (
            <div key={player.player_id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-blue-50 p-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {player.position}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Player ID: {player.player_id}</p>
                </div>
              </div>
              
              <div className="p-5">
                <Link 
                  to={`/players/${player.player_id}`} 
                  className="block text-xl font-bold text-gray-900 hover:text-blue-600"
                >
                  {player.player_name || 'Unknown Player'}
                </Link>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Team:</span> {player.teams || 'None'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Age:</span> {player.age ? `${player.age} years` : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Goals:</span> {player.goals !== undefined ? player.goals : 'Unknown'}
                  </p>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/players/${player.player_id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Player Profile →
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
