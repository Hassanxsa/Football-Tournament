import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const TournamentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dummy data based on the schema
  const tournament = {
    tr_id: parseInt(id),
    tr_name: id === '1' ? 'Faculty Tournament' : id === '2' ? 'Open Tournament' : 'Student Tournament',
    start_date: id === '1' ? '2023-03-10' : id === '2' ? '2023-03-15' : '2022-12-10',
    end_date: id === '1' ? '2023-03-25' : id === '2' ? '2023-03-30' : '2022-12-25',
  };

  // Teams in this tournament
  const teams = [
    { team_id: 1214, tr_id: 1, team_name: 'CCM', team_group: 'A', match_played: 3, won: 0, draw: 3, lost: 0, goal_for: 4, goal_against: 4, goal_diff: 0, points: 3, group_position: 1 },
    { team_id: 1215, tr_id: 1, team_name: 'KBS', team_group: 'B', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 3, goal_against: 4, goal_diff: -1, points: 4, group_position: 2 },
    { team_id: 1216, tr_id: 2, team_name: 'CEP', team_group: 'C', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 0, goal_against: 0, goal_diff: 0, points: 4, group_position: 2 },
    { team_id: 1217, tr_id: 2, team_name: 'CPG', team_group: 'A', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 1, goal_against: 4, goal_diff: -3, points: 4, group_position: 1 },
    { team_id: 1218, tr_id: 3, team_name: 'CCM', team_group: 'A', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 2, goal_against: 4, goal_diff: -2, points: 4, group_position: 3 },
  ];

  // Matches in this tournament
  const matches = [
    {
      match_no: 1,
      play_stage: 'G',
      play_date: '2023-03-11',
      team_id1: 1214,
      team_id2: 1215,
      team_name1: 'CCM',
      team_name2: 'KBS',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 2,
      play_stage: 'G',
      play_date: '2023-03-11',
      team_id1: 1215,
      team_id2: 1216,
      team_name1: 'KBS',
      team_name2: 'CEP',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    }
  ];

  // Filter teams and matches for this tournament
  const tournamentTeams = teams.filter(team => team.tr_id === parseInt(id));
  const tournamentMatches = matches.filter(match => 
    tournamentTeams.some(team => team.team_id === match.team_id1 || team.team_id === match.team_id2)
  );

  // Get unique groups
  const groups = [...new Set(tournamentTeams.map(team => team.team_group))].sort();

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'G': return 'Group Stage';
      case 'R': return 'Round of 16';
      case 'Q': return 'Quarter Final';
      case 'S': return 'Semi Final';
      case 'F': return 'Final';
      default: return stage;
    }
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
      
      {/* Tournament Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tournament.tr_name}</h1>
          <p className="text-blue-200">
            {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tournament Tabs */}
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
                onClick={() => setActiveTab('matches')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'matches' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Matches
              </button>
              <button 
                onClick={() => setActiveTab('teams')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'teams' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Teams
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div>
            {/* Tournament Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tournament Details</h3>
                <dl>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Name:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{tournament.tr_name}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Start Date:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{new Date(tournament.start_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">End Date:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{new Date(tournament.end_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Teams:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{tournamentTeams.length}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Matches:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{tournamentMatches.length}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upcoming Matches</h3>
                {tournamentMatches.length > 0 ? (
                  <div className="space-y-3">
                    {tournamentMatches.slice(0, 3).map((match) => (
                      <div key={match.match_no} className="border-b pb-3 last:border-b-0">
                        <div className="text-xs text-gray-500 mb-1">{new Date(match.play_date).toLocaleDateString()} • {getStageLabel(match.play_stage)}</div>
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{match.team_name1}</div>
                          <div className="text-sm bg-gray-100 px-2 py-1 rounded">{match.goal_score}</div>
                          <div className="font-medium">{match.team_name2}</div>
                        </div>
                        <Link to={`/matches/${match.match_no}`} className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block">
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No matches available.</p>
                )}
              </div>
            </div>

            {/* Standings */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Standings</h2>
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
                        {tournamentTeams
                          .filter(team => team.team_group === group)
                          .sort((a, b) => a.group_position - b.group_position)
                          .map((team) => (
                            <tr key={team.team_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{team.group_position}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                <Link to={`/teams/${team.team_id}`} className="hover:text-blue-600">
                                  {team.team_name}
                                </Link>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.match_played}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.won}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.draw}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.lost}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_for}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_against}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_diff}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-center">{team.points}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">All Matches</h2>
            {tournamentMatches.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Team</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Away Team</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournamentMatches.map((match) => (
                      <tr key={match.match_no} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(match.play_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStageLabel(match.play_stage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link to={`/teams/${match.team_id1}`} className="hover:text-blue-600">
                            {match.team_name1}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {match.goal_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link to={`/teams/${match.team_id2}`} className="hover:text-blue-600">
                            {match.team_name2}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/matches/${match.match_no}`} className="text-blue-600 hover:text-blue-900">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No matches available for this tournament.</p>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Participating Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentTeams.map(team => (
                <div key={team.team_id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    <Link to={`/teams/${team.team_id}`} className="hover:text-blue-600">
                      {team.team_name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Group {team.team_group}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="font-medium">{team.group_position}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Points</p>
                      <p className="font-medium">{team.points}</p>
                    </div>
                  </div>
                  
                  <Link to={`/teams/${team.team_id}`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
                    View Team Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;
