import React from 'react';
import { Link, useParams } from 'react-router-dom';

const PlayerDetails = () => {
  const { id } = useParams();
  
  // Dummy data for player details
  const players = [
    { player_id: 1001, name: 'Ahmed', jersey_no: 1, position_to_play: 'GK', position_desc: 'Goalkeepers', date_of_birth: '1999-03-10', team_name: 'CCM', team_id: 101 },
    { player_id: 1003, name: 'Saeed', jersey_no: 2, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '2005-03-10', team_name: 'KBS', team_id: 102 },
    { player_id: 1005, name: 'Majid', jersey_no: 3, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '1996-03-10', team_name: 'CCM', team_id: 101 },
    { player_id: 1007, name: 'Ahmed', jersey_no: 4, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '2001-03-10', team_name: 'CPG', team_id: 103 },
    { player_id: 1009, name: 'Fahd', jersey_no: 5, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '2008-03-10', team_name: 'CEP', team_id: 104 },
    { player_id: 1011, name: 'Mohammed', jersey_no: 6, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '1998-03-10', team_name: 'CDB', team_id: 105 },
    { player_id: 1013, name: 'Raed', jersey_no: 7, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '1999-07-10', team_name: 'CCM', team_id: 101 },
    { player_id: 1015, name: 'Mousa', jersey_no: 8, position_to_play: 'DF', position_desc: 'Defenders', date_of_birth: '2009-03-10', team_name: 'KBS', team_id: 102 },
    { player_id: 1017, name: 'Ali', jersey_no: 9, position_to_play: 'FD', position_desc: 'Forwards', date_of_birth: '2009-03-10', team_name: 'CCM', team_id: 101 },
    { player_id: 1019, name: 'Yasir', jersey_no: 10, position_to_play: 'MF', position_desc: 'Midfielders', date_of_birth: '2007-03-10', team_name: 'CPG', team_id: 103 },
  ];

  // Dummy data for recent matches
  const recentMatches = [
    { match_id: 2001, match_date: '2023-09-15', team_name1: 'CCM', team_name2: 'KBS', goal_score: '2-1' },
    { match_id: 2003, match_date: '2023-08-28', team_name1: 'CCM', team_name2: 'CPG', goal_score: '0-0' },
    { match_id: 2005, match_date: '2023-08-10', team_name1: 'CEP', team_name2: 'CCM', goal_score: '1-3' }
  ];

  // Find player by ID
  const player = players.find(p => p.player_id === parseInt(id)) || players[0];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/players" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Players
          </Link>
        </div>
      </div>
      
      {/* Player Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
          <p className="text-blue-200">
            {player.position_desc} • {player.team_name}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Player Info Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-50 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                  <p className="text-blue-600 font-medium">{player.position_desc}</p>
                </div>
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{player.jersey_no}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Player ID</p>
                    <p className="text-lg font-medium">{player.player_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-medium">{player.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jersey Number</p>
                    <p className="text-lg font-medium">{player.jersey_no}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-lg font-medium">{player.position_desc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-lg font-medium">{new Date(player.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-lg font-medium">{calculateAge(player.date_of_birth)}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500">Team</p>
                  <Link to={`/teams/${player.team_id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {player.team_name}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Matches */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentMatches.map(match => (
                        <tr key={match.match_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(match.match_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {match.team_name1} vs {match.team_name2}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {match.goal_score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/matches/${match.match_id}`} className="text-blue-600 hover:text-blue-800">
                              View Details
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
          
          {/* Stats Overview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Player Statistics</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Goals</p>
                    <p className="text-2xl font-bold text-blue-600">5</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Assists</p>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Yellow Cards</p>
                    <p className="text-2xl font-bold text-blue-600">2</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Red Cards</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Matches Played</p>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
