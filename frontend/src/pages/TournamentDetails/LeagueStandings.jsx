import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentService } from '../../services/api';

const LeagueStandings = () => {
  const { id } = useParams(); // Tournament ID
  const [standings, setStandings] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recalculatingStandings, setRecalculatingStandings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tournament details and standings in parallel
        const [tournamentData, standingsData] = await Promise.all([
          tournamentService.getTournamentById(id),
          tournamentService.getTournamentStandings(id)
        ]);
        
        setTournament(tournamentData);
        setStandings(standingsData);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError('Failed to load standings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRecalculateStandings = async () => {
    if (recalculatingStandings) return;
    
    setRecalculatingStandings(true);
    try {
      await tournamentService.recalculateStandings(id);
      // Refresh standings after recalculation
      const refreshedStandings = await tournamentService.getTournamentStandings(id);
      setStandings(refreshedStandings);
    } catch (err) {
      console.error('Error recalculating standings:', err);
      setError('Failed to recalculate standings. Please try again.');
    } finally {
      setRecalculatingStandings(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-800">
          {tournament?.tr_name} - League Standings
        </h1>
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
                    {team.team_name}
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

export default LeagueStandings;
