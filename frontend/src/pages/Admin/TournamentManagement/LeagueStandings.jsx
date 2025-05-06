import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data for standings
const generateMockStandings = (tournamentId) => {
  // Generate different standings based on tournament ID for realism
  const teamCount = tournamentId % 5 + 8; // Between 8-12 teams
  
  const teamNames = [
    'Al Hilal', 'Al Nassr', 'Al Ahli', 'Al Ittihad', 'Al Ettifaq',
    'Al Shabab', 'Al Taawoun', 'Al Fayha', 'Al Fateh', 'Al Wehda',
    'Al Khaleej', 'Al Raed', 'Al Riyadh', 'Al Okhdood', 'Al Qadisiyah', 'Al Hazem'
  ];
  
  // Take a subset of teams for this tournament
  const tournamentTeams = teamNames.slice(0, teamCount);
  
  // Generate standings with realistic stats
  return tournamentTeams.map((teamName, index) => {
    const played = 10 + Math.floor(Math.random() * 6); // 10-15 games played
    const won = Math.floor(Math.random() * (played - 2)) + 1; // 1 to (played-2) wins
    const drawn = Math.floor(Math.random() * (played - won)); // 0 to (played-won) draws
    const lost = played - won - drawn; // Remaining games are losses
    
    const goalsFor = won * 2 + drawn + Math.floor(Math.random() * 10); // Approximate goals scored
    const goalsAgainst = lost * 2 + drawn + Math.floor(Math.random() * 8); // Approximate goals conceded
    
    return {
      team_id: 100 + index,
      team_name: teamName,
      played,
      won,
      drawn,
      lost,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      goal_difference: goalsFor - goalsAgainst,
      points: won * 3 + drawn
    };
  }).sort((a, b) => {
    // Sort by points, then goal difference, then goals scored
    if (b.points !== a.points) return b.points - a.points;
    if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
    return b.goals_for - a.goals_for;
  }).map((team, index) => ({
    ...team,
    position: index + 1 // Add position after sorting
  }));
};

// Mock tournament data
const getMockTournament = (id) => ({
  tr_id: id,
  tr_name: `Tournament ${id}`,
  tr_type: 'League',
  start_date: '2023-01-01',
  end_date: '2023-05-30',
  season: '2023',
  venue_name: 'Main Stadium',
  team_count: 10
});

const AdminLeagueStandings = () => {
  const { trId } = useParams(); // Tournament ID
  const [standings, setStandings] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recalculatingStandings, setRecalculatingStandings] = useState(false);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        // Use mock data instead of API calls
        const mockTournament = getMockTournament(trId);
        const mockStandings = generateMockStandings(trId);
        
        setTournament(mockTournament);
        setStandings(mockStandings);
        setLoading(false);
      } catch (err) {
        console.error('Error generating mock data:', err);
        setError('Failed to load standings. Please try again.');
        setLoading(false);
      }
    }, 800); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [trId]);

  const handleRecalculateStandings = () => {
    if (recalculatingStandings) return;
    
    setRecalculatingStandings(true);
    
    // Simulate recalculation with a delay
    setTimeout(() => {
      // Generate new mock standings after "recalculation"
      const refreshedStandings = generateMockStandings(trId);
      setStandings(refreshedStandings);
      setRecalculatingStandings(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            to={`/admin/tournaments/${trId}/matches`}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Matches
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {tournament?.tr_name} - League Standings
          </h1>
        </div>
        <button
          onClick={handleRecalculateStandings}
          disabled={recalculatingStandings}
          className={`px-4 py-2 rounded text-white ${
            recalculatingStandings ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {recalculatingStandings ? 'Recalculating...' : 'Recalculate Standings'}
        </button>
      </div>

      {standings.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">No standings available</p>
          <p>There are no standings available for this tournament yet. Standings will be generated automatically as matches are played.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings.map((team) => (
                <tr key={team.team_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link to={`/teams/${team.team_id}`} className="hover:text-blue-600">
                      {team.team_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.played}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.won}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.drawn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.lost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.goals_for}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.goals_against}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div><span className="font-bold">P:</span> Played</div>
          <div><span className="font-bold">W:</span> Won</div>
          <div><span className="font-bold">D:</span> Drawn</div>
          <div><span className="font-bold">L:</span> Lost</div>
          <div><span className="font-bold">GF:</span> Goals For</div>
          <div><span className="font-bold">GA:</span> Goals Against</div>
          <div><span className="font-bold">GD:</span> Goal Difference</div>
          <div><span className="font-bold">Pts:</span> Points</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeagueStandings;
