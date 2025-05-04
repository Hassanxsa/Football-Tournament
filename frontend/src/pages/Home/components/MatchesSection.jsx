import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeService } from '../../../services/api';

const MatchesSection = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await homeService.getHomeData();
        setMatches(data.recentMatches || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

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
        <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Recent Matches
        </span>
      </div>
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading matches...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No recent matches found</div>
      ) : (
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
                  <p className="text-sm text-gray-500 mb-1">Match #{match.match_no} • {new Date(match.play_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 mb-2">{match.venue}</p>
                </div>
                
                <div className="flex items-center space-x-3 md:space-x-6">
                  <div className="text-right">
                    <p className="font-semibold">{match.team1}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold">{match.results}</div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getResultClass(match.results)}`}>
                      {match.results && match.results.includes('-') ? 'FINAL' : 'TBD'}
                    </span>
                  </div>
                  
                  <div className="text-left">
                    <p className="font-semibold">{match.team2}</p>
                  </div>
                </div>
                
                <Link to={`/matches/${match.match_no}`} className="mt-4 md:mt-0 text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                  Match Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesSection;
