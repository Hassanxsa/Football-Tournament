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

  // Tournament teams for unified league format
  const tournamentTeams = [
    // Tournament 1 - KFUPM Faculty League
    { team_id: 1214, tr_id: 1, team_name: 'CCM', match_played: 7, won: 6, draw: 1, lost: 0, goal_for: 19, goal_against: 6, goal_diff: 13, points: 19 },
    { team_id: 1216, tr_id: 1, team_name: 'CEP', match_played: 7, won: 5, draw: 1, lost: 1, goal_for: 15, goal_against: 7, goal_diff: 8, points: 16 },
    { team_id: 1215, tr_id: 1, team_name: 'KBS', match_played: 7, won: 4, draw: 2, lost: 1, goal_for: 11, goal_against: 8, goal_diff: 3, points: 14 },
    { team_id: 1218, tr_id: 1, team_name: 'CIE', match_played: 7, won: 4, draw: 0, lost: 3, goal_for: 12, goal_against: 10, goal_diff: 2, points: 12 },
    { team_id: 1219, tr_id: 1, team_name: 'MGE', match_played: 7, won: 3, draw: 1, lost: 3, goal_for: 10, goal_against: 9, goal_diff: 1, points: 10 },
    { team_id: 1220, tr_id: 1, team_name: 'CHE', match_played: 7, won: 2, draw: 3, lost: 2, goal_for: 8, goal_against: 9, goal_diff: -1, points: 9 },
    { team_id: 1221, tr_id: 1, team_name: 'ARC', match_played: 7, won: 2, draw: 2, lost: 3, goal_for: 7, goal_against: 9, goal_diff: -2, points: 8 },
    { team_id: 1217, tr_id: 1, team_name: 'CPG', match_played: 7, won: 1, draw: 2, lost: 4, goal_for: 5, goal_against: 12, goal_diff: -7, points: 5 },
    { team_id: 1222, tr_id: 1, team_name: 'COE', match_played: 7, won: 0, draw: 2, lost: 5, goal_for: 4, goal_against: 14, goal_diff: -10, points: 2 },
    { team_id: 1223, tr_id: 1, team_name: 'ICS', match_played: 7, won: 0, draw: 0, lost: 7, goal_for: 3, goal_against: 10, goal_diff: -7, points: 0 },
    
    // Tournament 2 - KFUPM Student League
    { team_id: 1214, tr_id: 2, team_name: 'CCM', match_played: 5, won: 4, draw: 1, lost: 0, goal_for: 12, goal_against: 3, goal_diff: 9, points: 13 },
    { team_id: 1224, tr_id: 2, team_name: 'PHY', match_played: 5, won: 3, draw: 1, lost: 1, goal_for: 10, goal_against: 5, goal_diff: 5, points: 10 },
    { team_id: 1225, tr_id: 2, team_name: 'LAS', match_played: 5, won: 3, draw: 0, lost: 2, goal_for: 8, goal_against: 7, goal_diff: 1, points: 9 },
    { team_id: 1217, tr_id: 2, team_name: 'CPG', match_played: 5, won: 2, draw: 2, lost: 1, goal_for: 7, goal_against: 5, goal_diff: 2, points: 8 },
    { team_id: 1226, tr_id: 2, team_name: 'EED', match_played: 5, won: 2, draw: 1, lost: 2, goal_for: 6, goal_against: 8, goal_diff: -2, points: 7 },
    { team_id: 1215, tr_id: 2, team_name: 'KBS', match_played: 5, won: 1, draw: 2, lost: 2, goal_for: 5, goal_against: 6, goal_diff: -1, points: 5 },
    { team_id: 1227, tr_id: 2, team_name: 'ACC', match_played: 5, won: 1, draw: 0, lost: 4, goal_for: 3, goal_against: 10, goal_diff: -7, points: 3 },
    { team_id: 1228, tr_id: 2, team_name: 'BIO', match_played: 5, won: 0, draw: 1, lost: 4, goal_for: 2, goal_against: 9, goal_diff: -7, points: 1 }
  ];

  // Matches involving this team - mix of played and upcoming that match the standings statistics
  const matches = [
    // Week 1 Matches
    {
      match_no: 1,
      play_stage: 'G',
      play_date: '2023-03-01',
      team_id1: 1214,
      team_id2: 1223,
      team_name1: 'CCM',
      team_name2: 'ICS',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-0',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 6,
      play_stage: 'G',
      play_date: '2023-03-05',
      team_id1: 1214,
      team_id2: 1222,
      team_name1: 'CCM',
      team_name2: 'COE',
      status: 'completed',
      results: 'WIN',
      goal_score: '4-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 11,
      play_stage: 'G',
      play_date: '2023-03-10',
      team_id1: 1214,
      team_id2: 1217,
      team_name1: 'CCM',
      team_name2: 'CPG',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 16,
      play_stage: 'G',
      play_date: '2023-03-14',
      team_id1: 1214,
      team_id2: 1218,
      team_name1: 'CCM',
      team_name2: 'CIE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 21,
      play_stage: 'G',
      play_date: '2023-03-19',
      team_id1: 1214,
      team_id2: 1215,
      team_name1: 'CCM',
      team_name2: 'KBS',
      status: 'completed',
      results: 'DRAW',
      goal_score: '2-2',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 26,
      play_stage: 'G',
      play_date: '2023-03-23',
      team_id1: 1214,
      team_id2: 1219,
      team_name1: 'CCM',
      team_name2: 'MGE',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    {
      match_no: 31,
      play_stage: 'G',
      play_date: '2023-03-27',
      team_id1: 1214,
      team_id2: 1220,
      team_name1: 'CCM',
      team_name2: 'CHE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    // Upcoming Matches
    {
      match_no: 36,
      play_stage: 'Q',
      play_date: '2023-04-02',
      team_id1: 1214,
      team_id2: 1218,
      team_name1: 'CCM',
      team_name2: 'CIE',
      status: 'scheduled',
      results: '',
      goal_score: '-',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 1,
      tournament_name: 'Faculty Tournament'
    },
    // Student League matches
    {
      match_no: 101,
      play_stage: 'G',
      play_date: '2023-02-15',
      team_id1: 1214,
      team_id2: 1227,
      team_name1: 'CCM',
      team_name2: 'ACC',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-0',
      venue_id: 22,
      venue_name: 'Indoor Stadium',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    },
    {
      match_no: 105,
      play_stage: 'G',
      play_date: '2023-02-22',
      team_id1: 1214,
      team_id2: 1225,
      team_name1: 'CCM',
      team_name2: 'LAS',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    },
    {
      match_no: 110,
      play_stage: 'G',
      play_date: '2023-03-01',
      team_id1: 1214,
      team_id2: 1226,
      team_name1: 'CCM',
      team_name2: 'EED',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-0',
      venue_id: 33,
      venue_name: 'Jabal Field',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    },
    {
      match_no: 115,
      play_stage: 'G',
      play_date: '2023-03-08',
      team_id1: 1214,
      team_id2: 1215,
      team_name1: 'CCM',
      team_name2: 'KBS',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-2',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    },
    {
      match_no: 120,
      play_stage: 'G',
      play_date: '2023-03-15',
      team_id1: 1224,
      team_id2: 1214,
      team_name1: 'PHY',
      team_name2: 'CCM',
      status: 'completed',
      results: 'DRAW',
      goal_score: '2-2',
      venue_id: 22,
      venue_name: 'Indoor Stadium',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    },
    {
      match_no: 125,
      play_stage: 'S',
      play_date: '2023-04-05',
      team_id1: 1214,
      team_id2: 1224,
      team_name1: 'CCM',
      team_name2: 'PHY',
      status: 'scheduled',
      results: '',
      goal_score: '-',
      venue_id: 11,
      venue_name: 'Main Stadium',
      tr_id: 2,
      tournament_name: 'Student Tournament'
    }
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

                {/* Tournament Standings Section */}
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tournament Standings</h3>
                    {teamTournaments.length > 0 && (
                      <Link to={`/tournaments/${teamTournaments[0].tr_id}`} className="text-sm text-blue-600 hover:text-blue-800">
                        View Tournament
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-200 p-4">
                    {teamTournaments.length > 0 ? (
                      <div>
                        {/* Tournament selector if team is in multiple tournaments */}
                        {teamTournaments.length > 1 && (
                          <div className="mb-4">
                            <label htmlFor="tournament-select" className="block text-sm font-medium text-gray-700 mb-1">
                              Select Tournament:
                            </label>
                            <select
                              id="tournament-select"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                              {teamTournaments.map((tournament) => (
                                <option key={tournament.tr_id} value={tournament.tr_id}>
                                  Tournament #{tournament.tr_id}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PTS</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {/* Get all teams from the current tournament (tr_id) and sort by points */}
                              {tournamentTeams
                                .filter(team => team.tr_id === teamTournaments[0]?.tr_id)
                                .sort((a, b) => {
                                  if (a.points !== b.points) return b.points - a.points; 
                                  if (a.goal_diff !== b.goal_diff) return b.goal_diff - a.goal_diff;
                                  return b.goal_for - a.goal_for;
                                })
                                .map((team, index) => (
                                  <tr key={team.team_id} 
                                      className={team.team_id === parseInt(id) ? 
                                        "bg-blue-50 font-medium" : 
                                        index < 2 ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                      <Link to={`/teams/${team.team_id}`} className="font-medium hover:text-blue-600">
                                        {team.team_name}
                                      </Link>
                                      {team.team_id === parseInt(id) && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          Your Team
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.match_played}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.won}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.draw}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.lost}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_for}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_against}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_diff}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{team.points}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Legend:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-green-50 mr-1"></span>
                              <span className="text-gray-600">Top 2 qualify for next round</span>
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-blue-50 mr-1"></span>
                              <span className="text-gray-600">Your team's position</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">This team is not currently participating in any tournaments.</p>
                    )}
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
