import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teamService } from '../../services/api';

const TeamMembers = () => {
  const { id: teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        // Fetch team details
        const teamData = await teamService.getTeamById(teamId);
        console.log('Team data:', teamData);
        setTeam(teamData);
        
        // Fetch team players
        const playersData = await teamService.getTeamPlayers(teamId);
        console.log('Team players:', playersData);
        setPlayers(Array.isArray(playersData) ? playersData : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Failed to load team details');
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  // Function to get random color for player avatar based on ID
  const getPlayerColor = (playerId) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800'
    ];
    const id = typeof playerId === 'string' ? parseInt(playerId, 10) || 0 : playerId || 0;
    return colors[id % colors.length];
  };

  // Get first letters of name for avatar
  const getNameInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Check if player is captain
  const isCaptain = (playerId) => {
    if (!team || !team.captain_id) return false;
    return String(team.captain_id) === String(playerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Team Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{team?.team_name || 'Team Members'}</h1>
              <p className="text-blue-200">
                <Link to="/teams" className="hover:text-white">Teams</Link> /&nbsp;
                <span>{team?.team_name || 'Loading...'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {/* Team Stats */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Team Name</p>
                  <p className="text-lg font-semibold">{team?.team_name || 'N/A'}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Captain</p>
                  <p className="text-lg font-semibold">{team?.captain_name || 'None'}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Players</p>
                  <p className="text-lg font-semibold">{team?.num_players || players.length || 0}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold">
                    {team?.status || 'Active'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Team Members List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Team Players</h2>
              </div>

              {players.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No players found for this team.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {players.map((player) => (
                    <li key={player.player_id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${getPlayerColor(player.player_id)}`}>
                          <span className="text-xl font-semibold">{getNameInitials(player.name || player.player_name)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-lg font-medium text-gray-900 truncate">
                              {player.name || player.player_name}
                            </p>
                            {isCaptain(player.player_id) && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clipRule="evenodd" />
                                  <path d="M10 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Captain
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              {player.position || player.position_desc || 'Player'}
                            </span>
                            {player.jersey_no && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                #{player.jersey_no}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link 
                          to={`/players/${player.player_id}`} 
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Profile
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
