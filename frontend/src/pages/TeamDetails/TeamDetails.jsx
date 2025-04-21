import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const TeamDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy data based on the schema
  const team = {
    team_id: parseInt(id),
    team_name: id === '1214' ? 'CCM' : id === '1215' ? 'KBS' : id === '1216' ? 'CEP' : 'CPG',
  };

  // Players in this team
  const players = [
    { player_id: 1001, team_id: 1214, tr_id: 1, name: 'Ahmed', jersey_no: 1, position_to_play: 'GK', position_desc: 'Goalkeepers', date_of_birth: '1999-03-10' },
    { player_id: 1003, team_id: 1214, tr_id: 1, name: 'Saeed', jersey_no: 2, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '2005-03-10' },
    { player_id: 1005, team_id: 1214, tr_id: 1, name: 'Majid', jersey_no: 3, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '1996-03-10' },
    { player_id: 1007, team_id: 1215, tr_id: 1, name: 'Ahmed', jersey_no: 4, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '2001-03-10' },
    { player_id: 1009, team_id: 1216, tr_id: 1, name: 'Fahd', jersey_no: 5, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '2008-03-10' },
  ];

  // Tournament teams
  const tournamentTeams = [
    { team_id: 1214, tr_id: 1, team_name: 'CCM', team_group: 'A', match_played: 3, won: 0, draw: 3, lost: 0, goal_for: 4, goal_against: 4, goal_diff: 0, points: 3, group_position: 1 },
    { team_id: 1214, tr_id: 3, team_name: 'CCM', team_group: 'C', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 1, goal_against: 2, goal_diff: -1, points: 4, group_position: 2 },
    { team_id: 1215, tr_id: 1, team_name: 'KBS', team_group: 'B', match_played: 3, won: 1, draw: 1, lost: 1, goal_for: 3, goal_against: 4, goal_diff: -1, points: 4, group_position: 2 },
  ];

  // Matches involving this team
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
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'KFUPM Cup'
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
      venue_name: 'Indoor Stadium',
      tr_id: 1,
      tournament_name: 'KFUPM Cup'
    },
    {
      match_no: 3,
      play_stage: 'F',
      play_date: '2023-03-12',
      team_id1: 1214,
      team_id2: 1215,
      team_name1: 'CCM',
      team_name2: 'KBS',
      results: 'LOSS',
      goal_score: '1-3',
      venue_id: 33,
      venue_name: 'Jabal Field',
      tr_id: 1,
      tournament_name: 'KFUPM Cup'
    },
    {
      match_no: 4,
      play_stage: 'G',
      play_date: '2023-03-13',
      team_id1: 1214,
      team_id2: 1215,
      team_name1: 'CCM',
      team_name2: 'KBS',
      results: 'WIN',
      goal_score: '5-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'KFUPM Cup'
    },
  ];

  // Filter team data
  const teamPlayers = players.filter(player => player.team_id === parseInt(id));
  const teamTournaments = tournamentTeams.filter(tt => tt.team_id === parseInt(id));
  const teamMatches = matches.filter(match => match.team_id1 === parseInt(id) || match.team_id2 === parseInt(id));

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

  // Team support staff
  const teamStaff = [
    { support_id: 9001, team_id: 1214, tr_id: 1, support_type: 'CH', support_desc: 'COACH', name: 'Carlos' },
    { support_id: 7001, team_id: 1214, tr_id: 1, support_type: 'AC', support_desc: 'ASST COACH', name: 'Hassan' },
  ];

  const teamSupport = teamStaff.filter(staff => staff.team_id === parseInt(id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-700 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{team.team_name}</h1>
              <p className="text-green-100">Team Details</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/teams" className="text-green-100 hover:text-white flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Teams
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'overview'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'players'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('players')}
          >
            Players
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'matches'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {/* Team Information */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Team Information</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Team Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{team.team_name}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Team ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{team.team_id}</dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Coach</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {teamSupport.find(staff => staff.support_type === 'CH')?.name || 'N/A'}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Number of Players</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teamPlayers.length}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              
                {/* Team Stats Preview */}
                <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Team Statistics</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Players</div>
                        <div className="text-2xl font-bold text-blue-600">{teamPlayers.length}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Matches</div>
                        <div className="text-2xl font-bold text-blue-600">{teamMatches.length}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Win Rate</div>
                        <div className="text-2xl font-bold text-blue-600">65%</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Goals</div>
                        <div className="text-2xl font-bold text-blue-600">15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Players & Matches Preview */}
              <div className="lg:col-span-2">
                {/* Players Preview */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Key Players</h3>
                    <button 
                      onClick={() => setActiveTab('players')} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All Players
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jersey No.
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teamPlayers.slice(0, 5).map(player => (
                            <tr key={player.player_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/players/${player.player_id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                  {player.name}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {player.position_desc}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {player.jersey_no}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Matches Preview */}
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Matches</h3>
                    <button 
                      onClick={() => setActiveTab('matches')} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All Matches
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Match
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Result
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teamMatches.slice(0, 3).map(match => (
                            <tr key={match.match_no} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(match.play_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">{match.team_name1}</span>
                                  <span className="mx-2 text-gray-400">vs</span>
                                  <span className="font-medium">{match.team_name2}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/matches/${match.match_no}`} className="inline-flex items-center">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 mr-2">
                                    {match.goal_score}
                                  </span>
                                  <span className="text-sm text-blue-600 hover:text-blue-800">Details</span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Team Players</h3>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {teamPlayers.length} Players
                </span>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jersey No.
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Birth
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamPlayers.map(player => (
                        <tr key={player.player_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/players/${player.player_id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              {player.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.position_desc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.jersey_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(player.date_of_birth).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/players/${player.player_id}`} className="text-blue-600 hover:text-blue-900">
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Team Matches</h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Match
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tournament
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamMatches.map(match => {
                        const isTeam1 = match.team_id1 === parseInt(id);
                        const score = match.goal_score.split('-');
                        const teamScore = isTeam1 ? score[0] : score[1];
                        const opponentScore = isTeam1 ? score[1] : score[0];
                        const opponent = isTeam1 ? match.team_name2 : match.team_name1;
                        
                        const result = 
                          (isTeam1 && match.results === 'WIN') || (!isTeam1 && match.results === 'LOSS') 
                            ? 'WIN' 
                            : (isTeam1 && match.results === 'LOSS') || (!isTeam1 && match.results === 'WIN')
                              ? 'LOSS'
                              : 'DRAW';
                        
                        return (
                          <tr key={match.match_no} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(match.play_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="font-medium">{match.team_name1}</span>
                                <span className="mx-2 text-gray-400">vs</span>
                                <span className="font-medium">{match.team_name2}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {match.tournament_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {match.goal_score}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link 
                                to={`/matches/${match.match_no}`} 
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Match Details
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
