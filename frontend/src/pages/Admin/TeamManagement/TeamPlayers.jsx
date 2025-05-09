import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teamService, playerService } from '../../../services/api';
import axios from 'axios';

const TeamPlayers = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        setLoading(true);
        // Fetch team details
        const teamData = await teamService.getTeamById(teamId);
        setTeam(teamData);
        
        // Get players directly from the API
        try {
          // Force numeric team ID
          const numTeamId = Number(teamId);
          const playersData = await teamService.getTeamPlayers(numTeamId);
          console.log(`Players for team ${numTeamId}:`, playersData);
          
          if (Array.isArray(playersData)) {
            setPlayers(playersData);
          } else {
            setPlayers([]);
          }
        } catch (error) {
          console.error('Error fetching team players:', error);
          setPlayers([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data: ' + (err.message || 'Unknown error'));
        setLoading(false);
      }
    };
    
    fetchTeamAndPlayers();
  }, [teamId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : team ? `${team.team_name} Players` : 'Team Players'}
          </h1>
          <p className="text-black">Manage players for this team</p>
        </div>
        <Link 
          to="/admin/players" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Player
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-black">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mr-1 ml-1">
            <Link to="/admin/teams" className="text-blue-600 hover:text-blue-800">Teams</Link> /
          </li>
          <li className="ml-1">Players</li>
        </ol>
      </nav>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-8">Loading team players...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {/* Debug information - Toggle with a local dev flag */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded overflow-auto max-h-40">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <div className="text-xs font-mono">
            <p>Team ID: {teamId}</p>
            <p>Players count: {players.length}</p>
            <p>Players data structure: {players.length > 0 ? Object.keys(players[0]).join(', ') : 'No players data'}</p>
          </div>
        </div>
      )}

      {/* Players List */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Team Players</h2>
          </div>
          
          {players.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg text-black font-medium mb-4">No players available in this team.</p>
              <div className="flex flex-col space-y-3 items-center">
                <Link 
                  to="/admin/players" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Players to Team
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  You need to add players to this team before they will appear here.
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Goals
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Yellow Cards
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Red Cards
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map(player => (
                  <tr key={player.player_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-black">{player.name || player.player_name}</div>
                          <div className="text-sm text-gray-500">ID: {player.player_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position_name || player.position || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.goals !== undefined ? player.goals : "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.yellow_cards !== undefined ? player.yellow_cards : "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.red_cards !== undefined ? player.red_cards : "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/players/${player.player_id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamPlayers;
