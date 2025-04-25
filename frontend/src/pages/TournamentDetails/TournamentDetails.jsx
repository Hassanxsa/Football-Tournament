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

  // Dummy data for teams in this tournament (unified league format)
  const teams = [
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
  ];

  // Matches in this tournament - mix of played and upcoming matches that match the standings statistics
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 2,
      play_stage: 'G',
      play_date: '2023-03-01',
      team_id1: 1216,
      team_id2: 1222,
      team_name1: 'CEP',
      team_name2: 'COE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 3,
      play_stage: 'G',
      play_date: '2023-03-02',
      team_id1: 1215,
      team_id2: 1220,
      team_name1: 'KBS',
      team_name2: 'CHE',
      status: 'completed',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 4,
      play_stage: 'G',
      play_date: '2023-03-02',
      team_id1: 1218,
      team_id2: 1221,
      team_name1: 'CIE',
      team_name2: 'ARC',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-0',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 5,
      play_stage: 'G',
      play_date: '2023-03-03',
      team_id1: 1219,
      team_id2: 1217,
      team_name1: 'MGE',
      team_name2: 'CPG',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 2 Matches
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 7,
      play_stage: 'G',
      play_date: '2023-03-05',
      team_id1: 1216,
      team_id2: 1220,
      team_name1: 'CEP',
      team_name2: 'CHE',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 8,
      play_stage: 'G',
      play_date: '2023-03-06',
      team_id1: 1215,
      team_id2: 1217,
      team_name1: 'KBS',
      team_name2: 'CPG',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-0',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 9,
      play_stage: 'G',
      play_date: '2023-03-06',
      team_id1: 1218,
      team_id2: 1219,
      team_name1: 'CIE',
      team_name2: 'MGE',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-2',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 10,
      play_stage: 'G',
      play_date: '2023-03-07',
      team_id1: 1221,
      team_id2: 1223,
      team_name1: 'ARC',
      team_name2: 'ICS',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-0',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 3 Matches
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 12,
      play_stage: 'G',
      play_date: '2023-03-10',
      team_id1: 1216,
      team_id2: 1221,
      team_name1: 'CEP',
      team_name2: 'ARC',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 13,
      play_stage: 'G',
      play_date: '2023-03-11',
      team_id1: 1215,
      team_id2: 1219,
      team_name1: 'KBS',
      team_name2: 'MGE',
      status: 'completed',
      results: 'DRAW',
      goal_score: '2-2',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 14,
      play_stage: 'G',
      play_date: '2023-03-11',
      team_id1: 1218,
      team_id2: 1220,
      team_name1: 'CIE',
      team_name2: 'CHE',
      status: 'completed',
      results: 'LOSS',
      goal_score: '1-2',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 15,
      play_stage: 'G',
      play_date: '2023-03-12',
      team_id1: 1222,
      team_id2: 1223,
      team_name1: 'COE',
      team_name2: 'ICS',
      status: 'completed',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 4 Matches
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 17,
      play_stage: 'G',
      play_date: '2023-03-14',
      team_id1: 1216,
      team_id2: 1215,
      team_name1: 'CEP',
      team_name2: 'KBS',
      status: 'completed',
      results: 'LOSS',
      goal_score: '1-2',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 18,
      play_stage: 'G',
      play_date: '2023-03-15',
      team_id1: 1220,
      team_id2: 1219,
      team_name1: 'CHE',
      team_name2: 'MGE',
      status: 'completed',
      results: 'DRAW',
      goal_score: '2-2',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 19,
      play_stage: 'G',
      play_date: '2023-03-15',
      team_id1: 1221,
      team_id2: 1222,
      team_name1: 'ARC',
      team_name2: 'COE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 20,
      play_stage: 'G',
      play_date: '2023-03-16',
      team_id1: 1217,
      team_id2: 1223,
      team_name1: 'CPG',
      team_name2: 'ICS',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-0',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 5 Matches (Some played, some scheduled)
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 22,
      play_stage: 'G',
      play_date: '2023-03-19',
      team_id1: 1216,
      team_id2: 1217,
      team_name1: 'CEP',
      team_name2: 'CPG',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-0',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 23,
      play_stage: 'G',
      play_date: '2023-03-20',
      team_id1: 1218,
      team_id2: 1223,
      team_name1: 'CIE',
      team_name2: 'ICS',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-1',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 24,
      play_stage: 'G',
      play_date: '2023-03-20',
      team_id1: 1219,
      team_id2: 1222,
      team_name1: 'MGE',
      team_name2: 'COE',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-0',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 25,
      play_stage: 'G',
      play_date: '2023-03-21',
      team_id1: 1220,
      team_id2: 1221,
      team_name1: 'CHE',
      team_name2: 'ARC',
      status: 'completed',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 6 Matches
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 27,
      play_stage: 'G',
      play_date: '2023-03-23',
      team_id1: 1216,
      team_id2: 1218,
      team_name1: 'CEP',
      team_name2: 'CIE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 28,
      play_stage: 'G',
      play_date: '2023-03-24',
      team_id1: 1215,
      team_id2: 1221,
      team_name1: 'KBS',
      team_name2: 'ARC',
      status: 'completed',
      results: 'WIN',
      goal_score: '3-1',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 29,
      play_stage: 'G',
      play_date: '2023-03-24',
      team_id1: 1220,
      team_id2: 1222,
      team_name1: 'CHE',
      team_name2: 'COE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 30,
      play_stage: 'G',
      play_date: '2023-03-25',
      team_id1: 1217,
      team_id2: 1223,
      team_name1: 'CPG',
      team_name2: 'ICS',
      status: 'completed',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Week 7 Matches
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 32,
      play_stage: 'G',
      play_date: '2023-03-27',
      team_id1: 1215,
      team_id2: 1218,
      team_name1: 'KBS',
      team_name2: 'CIE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    {
      match_no: 33,
      play_stage: 'G',
      play_date: '2023-03-28',
      team_id1: 1216,
      team_id2: 1219,
      team_name1: 'CEP',
      team_name2: 'MGE',
      status: 'completed',
      results: 'WIN',
      goal_score: '2-1',
      venue_id: 33,
      venue_name: 'Jabal Field'
    },
    {
      match_no: 34,
      play_stage: 'G',
      play_date: '2023-03-28',
      team_id1: 1217,
      team_id2: 1221,
      team_name1: 'CPG',
      team_name2: 'ARC',
      status: 'completed',
      results: 'LOSS',
      goal_score: '1-2',
      venue_id: 11,
      venue_name: 'Main Stadium'
    },
    {
      match_no: 35,
      play_stage: 'G',
      play_date: '2023-03-29',
      team_id1: 1222,
      team_id2: 1223,
      team_name1: 'COE',
      team_name2: 'ICS',
      status: 'completed',
      results: 'DRAW',
      goal_score: '1-1',
      venue_id: 22,
      venue_name: 'Indoor Stadium'
    },
    
    // Upcoming Matches for playoffs/final stages
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
      venue_name: 'Main Stadium'
    },
    {
      match_no: 37,
      play_stage: 'Q',
      play_date: '2023-04-02',
      team_id1: 1216,
      team_id2: 1215,
      team_name1: 'CEP',
      team_name2: 'KBS',
      status: 'scheduled',
      results: '',
      goal_score: '-',
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

            {/* Standings - Combined League Table */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Tournament Standings</h2>
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
                    {tournamentTeams
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
