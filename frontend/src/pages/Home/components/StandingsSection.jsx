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
  
  // Team standings data in unified league format
  const standings = [
    // Tournament 1 - Faculty Tournament (10 teams total)
    {
      team_id: 1214,
      tr_id: 1,
      team_name: 'CCM',
      match_played: 7,
      won: 6,
      draw: 1,
      lost: 0,
      goal_for: 19,
      goal_against: 6,
      goal_diff: 13,
      points: 19
    },
    {
      team_id: 1216,
      tr_id: 1,
      team_name: 'CEP',
      match_played: 7,
      won: 5,
      draw: 1,
      lost: 1,
      goal_for: 15,
      goal_against: 7,
      goal_diff: 8,
      points: 16
    },
    {
      team_id: 1215,
      tr_id: 1,
      team_name: 'KBS',
      match_played: 7,
      won: 4,
      draw: 2,
      lost: 1,
      goal_for: 11,
      goal_against: 8,
      goal_diff: 3,
      points: 14
    },
    {
      team_id: 1218,
      tr_id: 1,
      team_name: 'CIE',
      match_played: 7,
      won: 4,
      draw: 0,
      lost: 3,
      goal_for: 12,
      goal_against: 10,
      goal_diff: 2,
      points: 12
    },
    {
      team_id: 1219,
      tr_id: 1,
      team_name: 'MGE',
      match_played: 7,
      won: 3,
      draw: 1,
      lost: 3,
      goal_for: 10,
      goal_against: 9,
      goal_diff: 1,
      points: 10
    },
    {
      team_id: 1220,
      tr_id: 1,
      team_name: 'CHE',
      match_played: 7,
      won: 2,
      draw: 3,
      lost: 2,
      goal_for: 8,
      goal_against: 9,
      goal_diff: -1,
      points: 9
    },
    {
      team_id: 1221,
      tr_id: 1,
      team_name: 'ARC',
      match_played: 7,
      won: 2,
      draw: 2,
      lost: 3,
      goal_for: 7,
      goal_against: 9,
      goal_diff: -2,
      points: 8
    },
    {
      team_id: 1217,
      tr_id: 1,
      team_name: 'CPG',
      match_played: 7,
      won: 1,
      draw: 2,
      lost: 4,
      goal_for: 5,
      goal_against: 12,
      goal_diff: -7,
      points: 5
    },
    {
      team_id: 1222,
      tr_id: 1,
      team_name: 'COE',
      match_played: 7,
      won: 0,
      draw: 2,
      lost: 5,
      goal_for: 4,
      goal_against: 14,
      goal_diff: -10,
      points: 2
    },
    {
      team_id: 1223,
      tr_id: 1,
      team_name: 'ICS',
      match_played: 7,
      won: 0,
      draw: 0,
      lost: 7,
      goal_for: 3,
      goal_against: 10,
      goal_diff: -7,
      points: 0
    },
    
    // Tournament 2 - Open Tournament (8 teams total)
    {
      team_id: 1214,
      tr_id: 2,
      team_name: 'CCM',
      match_played: 6,
      won: 5,
      draw: 0,
      lost: 1,
      goal_for: 15,
      goal_against: 5,
      goal_diff: 10,
      points: 15
    },
    {
      team_id: 1229,
      tr_id: 2,
      team_name: 'SWE',
      match_played: 6,
      won: 5,
      draw: 0,
      lost: 1,
      goal_for: 13,
      goal_against: 7,
      goal_diff: 6,
      points: 15
    },
    {
      team_id: 1216,
      tr_id: 2,
      team_name: 'CEP',
      match_played: 6,
      won: 3,
      draw: 1,
      lost: 2,
      goal_for: 9,
      goal_against: 6,
      goal_diff: 3,
      points: 10
    },
    {
      team_id: 1230,
      tr_id: 2,
      team_name: 'MEC',
      match_played: 6,
      won: 3,
      draw: 0,
      lost: 3,
      goal_for: 8,
      goal_against: 7,
      goal_diff: 1,
      points: 9
    },
    {
      team_id: 1217,
      tr_id: 2,
      team_name: 'CPG',
      match_played: 6,
      won: 2,
      draw: 1,
      lost: 3,
      goal_for: 7,
      goal_against: 9,
      goal_diff: -2,
      points: 7
    },
    {
      team_id: 1231,
      tr_id: 2,
      team_name: 'PLT',
      match_played: 6,
      won: 2,
      draw: 0,
      lost: 4,
      goal_for: 6,
      goal_against: 11,
      goal_diff: -5,
      points: 6
    },
    {
      team_id: 1232,
      tr_id: 2,
      team_name: 'CCS',
      match_played: 6,
      won: 1,
      draw: 1,
      lost: 4,
      goal_for: 5,
      goal_against: 10,
      goal_diff: -5,
      points: 4
    },
    {
      team_id: 1233,
      tr_id: 2,
      team_name: 'ENG',
      match_played: 6,
      won: 0,
      draw: 1,
      lost: 5,
      goal_for: 2,
      goal_against: 10,
      goal_diff: -8,
      points: 1
    },
    
    // Tournament 3 - Student Tournament (8 teams total)
    {
      team_id: 1214,
      tr_id: 3,
      team_name: 'CCM',
      match_played: 5,
      won: 4,
      draw: 1,
      lost: 0,
      goal_for: 12,
      goal_against: 3,
      goal_diff: 9,
      points: 13
    },
    {
      team_id: 1224,
      tr_id: 3,
      team_name: 'PHY',
      match_played: 5,
      won: 3,
      draw: 1,
      lost: 1,
      goal_for: 10,
      goal_against: 5,
      goal_diff: 5,
      points: 10
    },
    {
      team_id: 1225,
      tr_id: 3,
      team_name: 'LAS',
      match_played: 5,
      won: 3,
      draw: 0,
      lost: 2,
      goal_for: 8,
      goal_against: 7,
      goal_diff: 1,
      points: 9
    },
    {
      team_id: 1217,
      tr_id: 3,
      team_name: 'CPG',
      match_played: 5,
      won: 2,
      draw: 2,
      lost: 1,
      goal_for: 7,
      goal_against: 5,
      goal_diff: 2,
      points: 8
    },
    {
      team_id: 1226,
      tr_id: 3,
      team_name: 'EED',
      match_played: 5,
      won: 2,
      draw: 1,
      lost: 2,
      goal_for: 6,
      goal_against: 8,
      goal_diff: -2,
      points: 7
    },
    {
      team_id: 1215,
      tr_id: 3,
      team_name: 'KBS',
      match_played: 5,
      won: 1,
      draw: 2,
      lost: 2,
      goal_for: 5,
      goal_against: 6,
      goal_diff: -1,
      points: 5
    },
    {
      team_id: 1227,
      tr_id: 3,
      team_name: 'ACC',
      match_played: 5,
      won: 1,
      draw: 0,
      lost: 4,
      goal_for: 3,
      goal_against: 10,
      goal_diff: -7,
      points: 3
    },
    {
      team_id: 1228,
      tr_id: 3,
      team_name: 'BIO',
      match_played: 5,
      won: 0,
      draw: 1,
      lost: 4,
      goal_for: 2,
      goal_against: 9,
      goal_diff: -7,
      points: 1
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
            {/* Sort all teams by points (descending), then goal difference, then goals for */}
            {filteredStandings
              .sort((a, b) => {
                if (a.points !== b.points) return b.points - a.points; // Higher points first
                if (a.goal_diff !== b.goal_diff) return b.goal_diff - a.goal_diff; // Higher goal diff first
                return b.goal_for - a.goal_for; // Higher goals for first
              })
              .map((team, index) => (
                <tr key={team.team_id} className={index < 2 ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link to={`/teams/${team.team_id}`} className="font-medium hover:text-blue-600">
                      {team.team_name}
                    </Link>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.match_played}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.won}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.draw}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.lost}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_for}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_against}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_diff}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{team.points}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        
        {/* Add legend below table */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="inline-block w-4 h-4 rounded-full bg-green-50 mr-1"></span>
              <span className="text-gray-600">Top 2 qualify for next round</span>
            </div>
            <div>
              <span>MP:</span>
              <span className="text-gray-600 ml-1">Matches Played</span>
            </div>
            <div>
              <span>W/D/L:</span>
              <span className="text-gray-600 ml-1">Win/Draw/Loss</span>
            </div>
            <div>
              <span>GF/GA:</span>
              <span className="text-gray-600 ml-1">Goals For/Against</span>
            </div>
            <div>
              <span>GD:</span>
              <span className="text-gray-600 ml-1">Goal Difference</span>
            </div>
            <div>
              <span>PTS:</span>
              <span className="text-gray-600 ml-1">Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsSection;
