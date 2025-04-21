import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Players = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  
  // Dummy data based on the database schema
  const players = [
    { player_id: 1001, name: 'Ahmed', jersey_no: 1, position_to_play: 'GK', position_desc: 'Goalkeepers', date_of_birth: '1999-03-10', team_name: 'CCM' },
    { player_id: 1003, name: 'Saeed', jersey_no: 2, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '2005-03-10', team_name: 'KBS' },
    { player_id: 1005, name: 'Majid', jersey_no: 3, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '1996-03-10', team_name: 'CCM' },
    { player_id: 1007, name: 'Ahmed', jersey_no: 4, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '2001-03-10', team_name: 'CPG' },
    { player_id: 1009, name: 'Fahd', jersey_no: 5, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '2008-03-10', team_name: 'CEP' },
    { player_id: 1011, name: 'Mohammed', jersey_no: 6, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '1998-03-10', team_name: 'CDB' },
    { player_id: 1013, name: 'Raed', jersey_no: 7, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '1999-07-10', team_name: 'CCM' },
    { player_id: 1015, name: 'Mousa', jersey_no: 8, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '2009-03-10', team_name: 'KBS' },
    { player_id: 1017, name: 'Ali', jersey_no: 9, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '2009-03-10', team_name: 'CCM' },
    { player_id: 1019, name: 'Yasir', jersey_no: 10, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '2007-03-10', team_name: 'CPG' },
  ];

  // Playing positions
  const positions = [
    { position_id: 'GK', position_desc: 'Goalkeepers' },
    { position_id: 'DF', position_desc: 'Defenders' },
    { position_id: 'MF', position_desc: 'Midfielders' },
    { position_id: 'FD', position_desc: 'Forwards' }
  ];

  // Filter players based on search term and position filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || player.position_to_play === filterPosition;
    return matchesSearch && matchesPosition;
  });

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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(e) => setFilterPosition(e.target.value)}
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
                Showing {filteredPlayers.length} out of {players.length} players
              </span>
            </div>
          </div>
        </div>
        
        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map(player => (
            <div key={player.player_id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-blue-50 p-4 flex justify-between items-center">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {player.position_desc}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Jersey #{player.jersey_no}</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">{player.jersey_no}</span>
                </div>
              </div>
              
              <div className="p-5">
                <Link 
                  to={`/players/${player.player_id}`} 
                  className="block text-xl font-bold text-gray-900 hover:text-blue-600"
                >
                  {player.name}
                </Link>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Team:</span> {player.team_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Age:</span> {calculateAge(player.date_of_birth)} years
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Date of Birth:</span> {new Date(player.date_of_birth).toLocaleDateString()}
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

        {/* No Results */}
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
