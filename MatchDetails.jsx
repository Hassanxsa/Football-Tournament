import React from 'react';
import { useParams, Link } from 'react-router-dom';

const MatchDetails = () => {
  const { id } = useParams();
  
  // Dummy data based on the schema
  const match = {
    match_no: parseInt(id),
    play_stage: 'G',
    play_date: '2023-03-11',
    team_id1: 1214,
    team_id2: 1215,
    team_name1: 'CCM',
    team_name2: 'KBS',
    results: 'WIN',
    decided_by: 'N',
    goal_score: '2-1',
    venue_id: 11,
    venue_name: 'Main Stadium',
    audience: 5113,
    player_of_match: 1007,
    stop1_sec: 131,
    stop2_sec: 242
  };

  // Match details
  const matchDetails = [
    { match_no: 1, team_id: 1214, win_lose: 'W', decided_by: 'N', goal_score: 1, penalty_score: 0, player_gk: 1001 },
    { match_no: 1, team_id: 1216, win_lose: 'L', decided_by: 'N', goal_score: 1, penalty_score: 0, player_gk: 1001 }
  ];

  // Goal details
  const goalDetails = [
    { goal_id: 1, match_no: 1, player_id: 1003, team_id: 1214, goal_time: 72, goal_type: 'N', play_stage: 'G', goal_schedule: 'NT', goal_half: 2, player_name: 'Saeed' },
    { goal_id: 2, match_no: 1, player_id: 1005, team_id: 1214, goal_time: 82, goal_type: 'N', play_stage: 'G', goal_schedule: 'NT', goal_half: 2, player_name: 'Majid' },
    { goal_id: 3, match_no: 1, player_id: 1003, team_id: 1214, goal_time: 77, goal_type: 'N', play_stage: 'G', goal_schedule: 'NT', goal_half: 2, player_name: 'Saeed' }
  ];

  // Player bookings
  const playerBookings = [
    { match_no: 1, team_id: 1215, player_id: 1003, booking_time: 36, sent_off: 'N', play_schedule: 'NT', play_half: 1, player_name: 'Saeed' }
  ];

  // Player in/out
  const playerInOut = [
    { match_no: 1, team_id: 1214, player_id: 1003, in_out: 'I', time_in_out: 73, play_schedule: 'NT', play_half: 2, player_name: 'Saeed' }
  ];

  // Match captains
  const matchCaptains = [
    { match_no: 1, team_id: 1214, player_captain: 1005, player_name: 'Majid' }
  ];

  // Match support
  const matchSupport = [
    { match_no: 1, support_id: 3002, support_type: 'RF', support_name: 'Fadhel', support_desc: 'REFEREE' },
    { match_no: 1, support_id: 3003, support_type: 'AR', support_name: 'Saied', support_desc: 'ASST REFEREE' }
  ];

  // Filter data for this match
  const matchSpecificDetails = matchDetails.filter(detail => detail.match_no === parseInt(id));
  const matchSpecificGoals = goalDetails.filter(goal => goal.match_no === parseInt(id));
  const matchSpecificBookings = playerBookings.filter(booking => booking.match_no === parseInt(id));
  const matchSpecificInOut = playerInOut.filter(inOut => inOut.match_no === parseInt(id));
  const matchSpecificCaptains = matchCaptains.filter(captain => captain.match_no === parseInt(id));
  const matchSpecificSupport = matchSupport.filter(support => support.match_no === parseInt(id));

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
      case 'W': return 'bg-green-100 text-green-800';
      case 'L': return 'bg-red-100 text-red-800';
      case 'D': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'N': return 'Normal';
      case 'O': return 'Own Goal';
      case 'P': return 'Penalty';
      default: return type;
    }
  };

  const getScheduleLabel = (schedule) => {
    switch (schedule) {
      case 'NT': return 'Normal Time';
      case 'ST': return 'Stoppage Time';
      case 'ET': return 'Extra Time';
      default: return schedule;
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

      {/* Match Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white text-blue-800 mb-4">
            {getStageLabel(match.play_stage)}
          </span>
          <h1 className="text-3xl font-bold mb-2">Match #{match.match_no}</h1>
          <p className="text-blue-200">
            {new Date(match.play_date).toLocaleDateString()} • {match.venue_name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Match Result */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-16">
            <div className="text-center">
              <Link to={`/teams/${match.team_id1}`} className="block">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">{match.team_name1.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold">{match.team_name1}</h3>
              </Link>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{match.goal_score}</div>
              <div className="text-sm text-gray-500">Full Time</div>
              {match.decided_by === 'P' && (
                <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Penalty Shootout
                </div>
              )}
            </div>

            <div className="text-center">
              <Link to={`/teams/${match.team_id2}`} className="block">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">{match.team_name2.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold">{match.team_name2}</h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Match Information</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-gray-500">Date:</dt>
              <dd className="text-sm text-gray-900">{new Date(match.play_date).toLocaleDateString()}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Stage:</dt>
              <dd className="text-sm text-gray-900">{getStageLabel(match.play_stage)}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Venue:</dt>
              <dd className="text-sm text-gray-900">{match.venue_name}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Audience:</dt>
              <dd className="text-sm text-gray-900">{match.audience.toLocaleString()}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Decided By:</dt>
              <dd className="text-sm text-gray-900">{match.decided_by === 'N' ? 'Normal Time' : 'Penalty Shootout'}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Stoppage Time (1st Half):</dt>
              <dd className="text-sm text-gray-900">{match.stop1_sec} seconds</dd>
              
              <dt className="text-sm font-medium text-gray-500">Stoppage Time (2nd Half):</dt>
              <dd className="text-sm text-gray-900">{match.stop2_sec} seconds</dd>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Match Officials</h2>
            {matchSpecificSupport.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {matchSpecificSupport.map((official) => (
                  <li key={official.support_id} className="py-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800">{official.support_name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{official.support_name}</p>
                      <p className="text-sm text-gray-500">{official.support_desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No match officials data available.</p>
            )}
          </div>
        </div>

        {/* Teams Performance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Teams Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goalkeeper</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Captain</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matchSpecificDetails.map((detail) => {
                  const isTeam1 = detail.team_id === match.team_id1;
                  const teamName = isTeam1 ? match.team_name1 : match.team_name2;
                  
                  // Find captain for this team
                  const captain = matchSpecificCaptains.find(c => c.team_id === detail.team_id);
                  
                  return (
                    <tr key={detail.team_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{teamName}</div>
                            <div className="text-sm text-gray-500">ID: {detail.team_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getResultClass(detail.win_lose)}`}>
                          {detail.win_lose === 'W' ? 'Win' : detail.win_lose === 'L' ? 'Loss' : 'Draw'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {detail.goal_score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Player #{detail.player_gk}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {captain ? `Player #${captain.player_captain}` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Match Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Goals</h2>
            {matchSpecificGoals.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {matchSpecificGoals.sort((a, b) => a.goal_time - b.goal_time).map((goal) => (
                  <li key={goal.goal_id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-800">⚽</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {goal.player_name} ({goal.team_id === match.team_id1 ? match.team_name1 : match.team_name2})
                          </p>
                          <p className="text-xs text-gray-500">
                            {getGoalTypeLabel(goal.goal_type)} • {getScheduleLabel(goal.goal_schedule)} • {goal.goal_half}nd Half
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{goal.goal_time}'</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No goal details available.</p>
            )}
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Bookings</h2>
            {matchSpecificBookings.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {matchSpecificBookings.sort((a, b) => a.booking_time - b.booking_time).map((booking, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-800">{booking.sent_off === 'Y' ? '🟥' : '🟨'}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.player_name} ({booking.team_id === match.team_id1 ? match.team_name1 : match.team_name2})
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.sent_off === 'Y' ? 'Red Card' : 'Yellow Card'} • {getScheduleLabel(booking.play_schedule)} • {booking.play_half}st Half
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{booking.booking_time}'</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No booking details available.</p>
            )}
          </div>
        </div>

        {/* Substitutions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Substitutions</h2>
          {matchSpecificInOut.length > 0 ? (
            <div className="space-y-4">
              {matchSpecificInOut.sort((a, b) => a.time_in_out - b.time_in_out).map((inOut, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {inOut.player_name} ({inOut.team_id === match.team_id1 ? match.team_name1 : match.team_name2})
                      </p>
                      <p className="text-xs text-gray-500">
                        {inOut.in_out === 'I' ? 'Substitution In' : 'Substitution Out'} • 
                        {getScheduleLabel(inOut.play_schedule)} • {inOut.play_half}{inOut.play_half === 1 ? 'st' : 'nd'} Half
                      </p>
                    </div>
                    <div className="text-sm font-medium">{inOut.time_in_out}'</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No substitution details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
