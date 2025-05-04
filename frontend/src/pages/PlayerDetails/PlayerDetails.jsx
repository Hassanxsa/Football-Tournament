import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { playerService } from '../../services/api';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch player details
        const playerData = await playerService.getPlayerById(id);
        setPlayer(playerData);
        
        // Fetch player matches
        const matchesData = await playerService.getPlayerMatches(id);
        setMatches(matchesData);
        
        // Fetch player stats
        const statsData = await playerService.getPlayerStats(id);
        setStats(statsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching player details:', err);
        setError('Failed to load player details');
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [id]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // If loading or error, show appropriate UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Loading player details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Player Not Found</h2>
          <p className="text-gray-600">The player you are looking for does not exist or has been removed.</p>
          <Link 
            to="/players" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            View All Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/players" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Players
          </Link>
        </div>
      </div>
      
      {/* Player Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
          <p className="text-blue-200">
            {player.position_desc} • {player.team_name}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Player Info Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-50 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                  <p className="text-blue-600 font-medium">{player.position_desc}</p>
                </div>
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{player.jersey_no}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Player ID</p>
                    <p className="text-lg font-medium">{player.player_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-medium">{player.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jersey Number</p>
                    <p className="text-lg font-medium">{player.jersey_no || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-lg font-medium">{player.position_desc || player.position_to_play || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-lg font-medium">
                      {player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-lg font-medium">
                      {player.date_of_birth ? calculateAge(player.date_of_birth) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500">Team</p>
                  <Link to={`/teams/${player.team_id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {player.team_name}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Matches */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h3>
                
                {matches && matches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {matches.map((match, index) => (
                          <tr key={match.match_no || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {match.play_date ? new Date(match.play_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {match.team_name1} vs {match.team_name2}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {match.goal_score || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link to={`/matches/${match.match_no}`} className="text-blue-600 hover:text-blue-800">
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No match data available for this player.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Player Statistics</h3>
                
                {stats ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Goals</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.goals || 0}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Assists</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.assists || 0}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Yellow Cards</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.yellow_cards || 0}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Red Cards</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.red_cards || 0}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Matches Played</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.matches_played || 0}</p>
                    </div>
                    
                    {player.position_to_play === 'GK' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Clean Sheets</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.clean_sheets || 0}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No statistics available for this player.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
