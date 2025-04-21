import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StandingsSection = () => {
  const [selectedTournament, setSelectedTournament] = useState(1);
  
  // Using dummy data based on the provided SQL schema
  const tournaments = [
    { tr_id: 1, tr_name: 'Faculty Tournament' },
    { tr_id: 2, tr_name: 'Open Tournament' },
    { tr_id: 3, tr_name: 'Student Tournament' }
  ];
  
  // Team standings data from TOURNAMENT_TEAM table
  const standings = [
    {
      team_id: 1214,
      tr_id: 1,
      team_name: 'CCM',
      team_group: 'A',
      match_played: 3,
      won: 0,
      draw: 3,
      lost: 0,
      goal_for: 4,
      goal_against: 4,
      goal_diff: 0,
      points: 3,
      group_position: 1
    },
    {
      team_id: 1215,
      tr_id: 1,
      team_name: 'KBS',
      team_group: 'B',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 3,
      goal_against: 4,
      goal_diff: -1,
      points: 4,
      group_position: 2
    },
    {
      team_id: 1216,
      tr_id: 2,
      team_name: 'CEP',
      team_group: 'C',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 0,
      goal_against: 0,
      goal_diff: 0,
      points: 4,
      group_position: 2
    },
    {
      team_id: 1217,
      tr_id: 2,
      team_name: 'CPG',
      team_group: 'A',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 1,
      goal_against: 4,
      goal_diff: -3,
      points: 4,
      group_position: 1
    },
    {
      team_id: 1218,
      tr_id: 3,
      team_name: 'CCM',
      team_group: 'A',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 2,
      goal_against: 4,
      goal_diff: -2,
      points: 4,
      group_position: 3
    },
    {
      team_id: 1219,
      tr_id: 3,
      team_name: 'CDB',
      team_group: 'B',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 4,
      goal_against: 2,
      goal_diff: 2,
      points: 4,
      group_position: 1
    },
    {
      team_id: 1220,
      tr_id: 3,
      team_name: 'CGS',
      team_group: 'C',
      match_played: 3,
      won: 1,
      draw: 1,
      lost: 1,
      goal_for: 1,
      goal_against: 2,
      goal_diff: -1,
      points: 4,
      group_position: 2
    }
  ];

  // Filter standings by selected tournament
  const filteredStandings = standings.filter(
    (team) => team.tr_id === selectedTournament
  );

  // Get unique groups in the selected tournament
  const groups = [...new Set(filteredStandings.map(team => team.team_group))].sort();

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Tournament Standings</h2>
        <Link to={`/tournaments/${selectedTournament}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Tournament Details →
        </Link>
      </div>
      
      <div className="mb-6">
        <label htmlFor="tournament-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Tournament:
        </label>
        <select
          id="tournament-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(Number(e.target.value))}
        >
          {tournaments.map((tournament) => (
            <option key={tournament.tr_id} value={tournament.tr_id}>
              {tournament.tr_name}
            </option>
          ))}
        </select>
      </div>

      {groups.map(group => (
        <div key={group} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Group {group}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStandings
                  .filter(team => team.team_group === group)
                  .sort((a, b) => a.group_position - b.group_position)
                  .map((team) => (
                    <tr key={team.team_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {team.group_position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/teams/${team.team_id}`} className="text-blue-600 hover:text-blue-800">
                          {team.team_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.match_played}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.won}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.draw}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.lost}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.goal_for}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.goal_against}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {team.goal_diff}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-center">
                        {team.points}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StandingsSection;
