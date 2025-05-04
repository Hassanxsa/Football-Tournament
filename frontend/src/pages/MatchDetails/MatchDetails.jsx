import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchService } from '../../services/api';

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [matchDetails, setMatchDetails] = useState([]);
  const [goalDetails, setGoalDetails] = useState([]);
  const [playerBookings, setPlayerBookings] = useState([]);
  const [playerInOut, setPlayerInOut] = useState([]);
  const [matchCaptains, setMatchCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch match data
        const matchData = await matchService.getMatchById(id);
        setMatch(matchData);
        
        // Fetch match details
        const matchDetailsData = await matchService.getMatchDetails(id);
        setMatchDetails(matchDetailsData);
        
        // Fetch goal details
        const goalData = await matchService.getGoalDetails(id);
        setGoalDetails(goalData);
        
        // Fetch player bookings
        const bookingsData = await matchService.getPlayerBookings(id);
        setPlayerBookings(bookingsData);
        
        // Fetch player in/out
        const inOutData = await matchService.getPlayerInOut(id);
        setPlayerInOut(inOutData);
        
        // Fetch match captains
        const captainsData = await matchService.getMatchCaptains(id);
        setMatchCaptains(captainsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Failed to load match details');
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  // If loading or error, show appropriate UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Match Not Found</h2>
          <p className="text-gray-600">The match you are looking for does not exist or has been removed.</p>
          <Link 
            to="/tournaments" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            View Tournaments
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to get stage label
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

  // Helper function to format time
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return '';
    const min = parseInt(minutes);
    return `${Math.floor(min)}m${min % 1 > 0 ? ` ${Math.round(min % 1 * 60)}s` : ''}`;
  };

  // Group goals by team
  const team1Goals = goalDetails.filter(goal => goal.team_id === match.team_id1);
  const team2Goals = goalDetails.filter(goal => goal.team_id === match.team_id2);

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/tournaments" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tournaments
          </Link>
        </div>
      </div>
      
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-blue-200 text-sm mb-2">{getStageLabel(match.play_stage)} · Match {match.match_no}</p>
          <div className="flex justify-between items-center">
            <div className="text-right flex-1 pr-4">
              <Link to={`/teams/${match.team_id1}`} className="text-xl md:text-3xl font-bold hover:underline">
                {match.team_name1}
              </Link>
            </div>
            <div className="text-center px-6">
              {match.results ? (
                <div className="bg-white text-gray-900 rounded-lg px-6 py-2 font-bold text-2xl md:text-4xl">
                  {match.goal_score}
                </div>
              ) : (
                <div className="bg-gray-700 text-white rounded-lg px-6 py-2 font-bold text-2xl md:text-4xl">
                  vs
                </div>
              )}
              <div className="text-sm mt-2">
                {new Date(match.play_date).toLocaleDateString()}
              </div>
            </div>
            <div className="text-left flex-1 pl-4">
              <Link to={`/teams/${match.team_id2}`} className="text-xl md:text-3xl font-bold hover:underline">
                {match.team_name2}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Match Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Match Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tournament</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.tr_name || 'Unknown Tournament'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                <dd className="mt-1 text-sm text-gray-900">{getStageLabel(match.play_stage)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(match.play_date).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Venue</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Link to={`/venues/${match.venue_id}`} className="text-blue-600 hover:text-blue-800">
                    {match.venue_name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Audience</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.audience?.toLocaleString() || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Result</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {match.results ? (
                    <span>
                      {match.team_name1} {match.results === 'WIN' ? 'won' : match.results === 'LOSS' ? 'lost' : 'drew'} {match.goal_score}
                      {match.decided_by === 'P' && ' (after penalties)'}
                    </span>
                  ) : (
                    'Not played yet'
                  )}
                </dd>
              </div>
              {match.player_of_match && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Player of the Match</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link to={`/players/${match.player_of_match}`} className="text-blue-600 hover:text-blue-800">
                      {match.player_of_match_name || `Player #${match.player_of_match}`}
                    </Link>
                  </dd>
                </div>
              )}
              {match.stop1_sec > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stoppage Time (1st Half)</dt>
                  <dd className="mt-1 text-sm text-gray-900">{Math.floor(match.stop1_sec / 60)}:{(match.stop1_sec % 60).toString().padStart(2, '0')}</dd>
                </div>
              )}
              {match.stop2_sec > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stoppage Time (2nd Half)</dt>
                  <dd className="mt-1 text-sm text-gray-900">{Math.floor(match.stop2_sec / 60)}:{(match.stop2_sec % 60).toString().padStart(2, '0')}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Captains</h3>
            {matchCaptains.length > 0 ? (
              <div className="space-y-4">
                {matchCaptains.map((captain, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-800">
                        {captain.team_id === match.team_id1 ? '1' : '2'}
                      </span>
                    </div>
                    <div>
                      <Link 
                        to={`/teams/${captain.team_id}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {captain.team_id === match.team_id1 ? match.team_name1 : match.team_name2}
                      </Link>
                      <div>
                        <Link 
                          to={`/players/${captain.player_id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {captain.player_name || `Player #${captain.player_id}`}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No captain information available</p>
            )}
          </div>
        </div>
        
        {/* Goals */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Goals</h3>
          </div>
          
          {goalDetails.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">{match.team_name1}</h4>
                  {team1Goals.length > 0 ? (
                    <ul className="space-y-3">
                      {team1Goals
                        .sort((a, b) => a.goal_time - b.goal_time)
                        .map((goal, index) => (
                          <li key={goal.goal_id || index} className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-800">{goal.goal_time}'</span>
                            </div>
                            <div>
                              <Link 
                                to={`/players/${goal.player_id}`}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                              >
                                {goal.player_name || `Player #${goal.player_id}`}
                              </Link>
                              <p className="text-xs text-gray-500">
                                {goal.goal_type === 'P' ? 'Penalty' : 
                                 goal.goal_type === 'O' ? 'Own Goal' : 
                                 'Normal Goal'}
                                {goal.goal_schedule === 'ST' && ' (Stoppage Time)'}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No goals scored</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">{match.team_name2}</h4>
                  {team2Goals.length > 0 ? (
                    <ul className="space-y-3">
                      {team2Goals
                        .sort((a, b) => a.goal_time - b.goal_time)
                        .map((goal, index) => (
                          <li key={goal.goal_id || index} className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-800">{goal.goal_time}'</span>
                            </div>
                            <div>
                              <Link 
                                to={`/players/${goal.player_id}`}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                              >
                                {goal.player_name || `Player #${goal.player_id}`}
                              </Link>
                              <p className="text-xs text-gray-500">
                                {goal.goal_type === 'P' ? 'Penalty' : 
                                 goal.goal_type === 'O' ? 'Own Goal' : 
                                 'Normal Goal'}
                                {goal.goal_schedule === 'ST' && ' (Stoppage Time)'}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No goals scored</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm text-gray-500">No goals scored in this match</p>
            </div>
          )}
        </div>
        
        {/* Bookings and Substitutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bookings</h3>
            </div>
            
            {playerBookings.length > 0 ? (
              <div className="p-6">
                <ul className="space-y-4">
                  {playerBookings
                    .sort((a, b) => a.booking_time - b.booking_time)
                    .map((booking, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3">
                          <div className={`w-6 h-8 ${booking.sent_off === 'Y' ? 'bg-red-500' : 'bg-yellow-400'} rounded`}></div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700">{booking.booking_time}'</span>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link 
                              to={`/teams/${booking.team_id}`}
                              className="text-sm text-gray-700"
                            >
                              {booking.team_id === match.team_id1 ? match.team_name1 : match.team_name2}
                            </Link>
                          </div>
                          <Link 
                            to={`/players/${booking.player_id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {booking.player_name || `Player #${booking.player_id}`}
                          </Link>
                          {booking.sent_off === 'Y' && (
                            <p className="text-xs text-red-600 font-medium mt-1">Sent Off</p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-sm text-gray-500">No bookings in this match</p>
              </div>
            )}
          </div>
          
          {/* Substitutions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Substitutions</h3>
            </div>
            
            {playerInOut.length > 0 ? (
              <div className="p-6">
                <ul className="space-y-4">
                  {playerInOut
                    .sort((a, b) => a.time_in_out - b.time_in_out)
                    .map((sub, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3">
                          <div className={`w-6 h-6 ${sub.in_out === 'I' ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">
                              {sub.in_out === 'I' ? 'IN' : 'OUT'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700">{sub.time_in_out}'</span>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link 
                              to={`/teams/${sub.team_id}`}
                              className="text-sm text-gray-700"
                            >
                              {sub.team_id === match.team_id1 ? match.team_name1 : match.team_name2}
                            </Link>
                          </div>
                          <Link 
                            to={`/players/${sub.player_id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {sub.player_name || `Player #${sub.player_id}`}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            {sub.play_schedule === 'ST' ? 'Stoppage Time' : 'Normal Time'}
                            {sub.play_half && ` · Half ${sub.play_half}`}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-sm text-gray-500">No substitutions in this match</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
