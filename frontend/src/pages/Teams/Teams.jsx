import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams({ search: searchTerm });
        setTeams(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams');
        setLoading(false);
      }
    };

    fetchTeams();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTeamLogo = (teamName) => {
    return teamName.charAt(0);
  };

  const getTeamColor = (teamId) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[teamId % colors.length];
  };

  return (
    <div className="min-h-screen">
      {/* Teams Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-blue-200">View all participating teams</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Teams
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by team name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        

        
        {/* Teams Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600">Loading teams...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div 
                key={team.team_id} 
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${getTeamColor(team.team_id)}`}>
                      <span className="text-2xl font-bold">{getTeamLogo(team.team_name)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{team.team_name}</h3>
                      <p className={`inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (team.status === 'active' || team.status === 'Active') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status || 'Active'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="border rounded-lg p-2">
                      <p className="text-xs text-gray-500">Tournaments</p>
                      <p className="text-lg font-semibold">{team.num_tournaments || 0}</p>
                    </div>
                    <div className="border rounded-lg p-2">
                      <p className="text-xs text-gray-500">Players</p>
                      <p className="text-lg font-semibold">{team.num_players || 0}</p>
                    </div>
                    <div className="border rounded-lg p-2">
                      <p className="text-xs text-gray-500">Matches</p>
                      <p className="text-lg font-semibold">{team.num_matches || 0}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      to={`/teams/${team.team_id}`} 
                      className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Team Details
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

export default Teams;
