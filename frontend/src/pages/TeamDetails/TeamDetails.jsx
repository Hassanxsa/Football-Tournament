import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamService, playerService } from '../../services/api';

const TeamDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRedCardPlayersOnly, setShowRedCardPlayersOnly] = useState(false);
  
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch team details
        const teamData = await teamService.getTeamById(id);
        setTeam(teamData);
        
        // Fetch players in this team
        let playersData = await teamService.getTeamPlayers(id);
        
        // Fetch player stats for each player
        playersData = await Promise.all(playersData.map(async (player) => {
          try {
            const stats = await playerService.getPlayerStats(player.player_id);
            return {
              ...player,
              goals: stats.goals || 0,
              yellow_cards: stats.yellow_cards || 0,
              red_cards: stats.red_cards || 0,
            };
          } catch (err) {
            console.error(`Error fetching stats for player ${player.player_id}:`, err);
            return {
              ...player,
              goals: 0,
              yellow_cards: 0,
              red_cards: 0
            };
          }
        }));
        
        setPlayers(playersData);
        
        // Fetch matches for this team
        const matchesData = await teamService.getTeamMatches(id);
        setMatches(matchesData);
        
        // Fetch tournaments this team participates in
        const tournamentsData = await teamService.getTeamTournaments(id);
        setTournaments(tournamentsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Failed to load team details');
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);
  
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
          <p className="mt-2 text-gray-600">Loading team details...</p>
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

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Team Not Found</h2>
          <p className="text-gray-600">The team you are looking for does not exist or has been removed.</p>
          <Link 
            to="/teams" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            View All Teams
          </Link>
        </div>
      </div>
    );
  }

  // Group players by position
  const playersByPosition = players.reduce((acc, player) => {
    const position = player.position_desc || 'Unknown';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(player);
    return acc;
  }, {});
  
  // Sort positions in logical order: GK, DF, MF, FD
  const positionOrder = { 'Goalkeepers': 1, 'Defenders': 2, 'Midfielders': 3, 'Forwards': 4 };
  const sortedPositions = Object.keys(playersByPosition).sort((a, b) => {
    return (positionOrder[a] || 99) - (positionOrder[b] || 99);
  });

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/teams" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Teams
          </Link>
        </div>
      </div>
      
      {/* Team Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{team.team_name}</h1>
          {team.team_group && (
            <p className="text-blue-200">Group {team.team_group}</p>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Team Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('players')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'players' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Players
              </button>
              <button 
                onClick={() => setActiveTab('matches')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'matches' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Matches
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div>
            {/* Team Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Team Details</h3>
                <dl>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Name:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{team.team_name}</dd>
                  </div>
                  {team.team_group && (
                    <div className="py-2 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Group:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{team.team_group}</dd>
                    </div>
                  )}
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Players:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{players.length}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Tournaments:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{tournaments.length}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Matches</h3>
                {matches.slice(0, 3).map((match, index) => (
                  <div key={match.match_no || index} className="mb-3 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{match.team_name1}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {match.status === 'completed' ? match.goal_score : 'vs'}
                      </span>
                      <span className="text-sm font-medium">{match.team_name2}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{new Date(match.play_date).toLocaleDateString()}</span>
                      <span>{match.venue_name}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <button 
                    onClick={() => setActiveTab('matches')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all matches →
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Top Players</h3>
                {players.slice(0, 5).map((player, index) => (
                  <div key={player.player_id || index} className="mb-3 flex items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">{player.jersey_no || index + 1}</span>
                    </div>
                    <div>
                      <Link 
                        to={`/players/${player.player_id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {player.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {player.position_desc || 'Unknown position'} · {calculateAge(player.date_of_birth)} years
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <button 
                    onClick={() => setActiveTab('players')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all players →
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tournament Performance */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tournament Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tournament
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MP
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        D
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GF
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GA
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GD
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournaments.map((tournament, index) => (
                      <tr key={tournament.tr_id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/tournaments/${tournament.tr_id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {tournament.tr_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.match_played || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.won || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.draw || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.lost || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.goal_for || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.goal_against || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tournament.goal_diff || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">{tournament.points || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'players' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Team Squad</h2>
              <div className="flex items-center">
                <label htmlFor="redCardFilter" className="mr-2 text-sm font-medium text-gray-700">
                  Show players with red cards only
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="redCardFilter"
                    className="sr-only peer" 
                    checked={showRedCardPlayersOnly}
                    onChange={() => setShowRedCardPlayersOnly(!showRedCardPlayersOnly)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {sortedPositions.map(position => {
              // Filter players in this position based on red card filter
              const filteredPlayers = showRedCardPlayersOnly 
                ? playersByPosition[position].filter(player => player.red_cards > 0)
                : playersByPosition[position];
                
              // Only show position group if there are players to display after filtering
              if (filteredPlayers.length === 0) return null;
              
              return (
                <div key={position} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <h3 className="text-lg font-medium text-gray-900">
                      {position} 
                      {showRedCardPlayersOnly && filteredPlayers.length > 0 && (
                        <span className="ml-2 text-sm text-red-600 font-normal">
                          ({filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} with red cards)
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Goals
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Yellow Cards
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Red Cards
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPlayers.map((player, index) => (
                        <tr key={player.player_id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {player.jersey_no || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {player.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.position_to_play || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {player.goals}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {player.yellow_cards}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <span className={player.red_cards > 0 ? 'text-red-600 font-bold' : ''}>
                              {player.red_cards}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/players/${player.player_id}`} className="text-blue-600 hover:text-blue-900">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'matches' && (
          <div>
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Team Matches</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {matches
                  .sort((a, b) => new Date(a.play_date) - new Date(b.play_date))
                  .map((match, index) => (
                    <div key={match.match_no || index} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                          {new Date(match.play_date).toLocaleDateString()} · {match.tr_name || 'Tournament'} · {match.venue_name}
                        </div>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {match.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-right pr-4">
                          <Link to={`/teams/${match.team_id1}`} className={`text-lg font-medium hover:text-blue-600 ${parseInt(id) === match.team_id1 ? 'font-bold' : ''}`}>
                            {match.team_name1}
                          </Link>
                        </div>
                        <div className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg">
                          <span className="font-semibold text-xl">
                            {match.status === 'completed' ? match.goal_score : 'vs'}
                          </span>
                        </div>
                        <div className="flex-1 text-left pl-4">
                          <Link to={`/teams/${match.team_id2}`} className={`text-lg font-medium hover:text-blue-600 ${parseInt(id) === match.team_id2 ? 'font-bold' : ''}`}>
                            {match.team_name2}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <Link to={`/matches/${match.match_no}`} className="text-sm text-blue-600 hover:text-blue-800">
                          View match details
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return '';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default TeamDetails;
