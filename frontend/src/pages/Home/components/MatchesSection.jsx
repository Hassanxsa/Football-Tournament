import React from 'react';
import { Link } from 'react-router-dom';

const MatchesSection = () => {
  // Using dummy data based on the provided SQL schema
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
      venue_name: 'Jabal Field'
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
      venue_name: 'Main Stadium'
    }
  ];

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

  const getResultClass = (result) => {
    switch (result) {
      case 'WIN': return 'bg-green-100 text-green-800';
      case 'LOSS': return 'bg-red-100 text-red-800';
      case 'DRAW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Recent Matches</h2>
        <Link to="/matches/1" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Matches →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <div 
            key={match.match_no} 
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                  {getStageLabel(match.play_stage)}
                </span>
                <p className="text-sm text-gray-500 mb-1">Match #{match.match_no} • {match.play_date}</p>
                <p className="text-sm text-gray-500 mb-2">{match.venue_name}</p>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-6">
                <div className="text-right">
                  <p className="font-semibold">{match.team_name1}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold">{match.goal_score}</div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getResultClass(match.results)}`}>
                    {match.results}
                  </span>
                </div>
                
                <div className="text-left">
                  <p className="font-semibold">{match.team_name2}</p>
                </div>
              </div>
              
              <Link to={`/matches/${match.match_no}`} className="mt-4 md:mt-0 text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                Match Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesSection;
