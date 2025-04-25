import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPlayers = () => {
  const [teams, setTeams] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [approvedPlayers, setApprovedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [teamFilter, setTeamFilter] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // Teams data
      const teamsData = [
        { team_id: 1214, team_name: 'CCM' },
        { team_id: 1215, team_name: 'KBS' },
        { team_id: 1216, team_name: 'CEP' },
        { team_id: 1217, team_name: 'CPG' },
        { team_id: 1218, team_name: 'CIE' },
        { team_id: 1219, team_name: 'MGE' }
      ];
      
      // Pending players data
      const pendingPlayersData = [
        { player_id: 2001, name: 'Yousef Al-Harbi', team_id: 1214, jersey_no: 14, position: 'Midfielder', date_of_birth: '2000-05-10', status: 'pending' },
        { player_id: 2002, name: 'Faisal Al-Otaibi', team_id: 1215, jersey_no: 9, position: 'Forward', date_of_birth: '1999-07-22', status: 'pending' },
        { player_id: 2003, name: 'Hassan Al-Qahtani', team_id: 1216, jersey_no: 5, position: 'Defender', date_of_birth: '2001-03-15', status: 'pending' },
        { player_id: 2004, name: 'Khalid Al-Shehri', team_id: 1217, jersey_no: 1, position: 'Goalkeeper', date_of_birth: '1998-11-30', status: 'pending' },
        { player_id: 2005, name: 'Majid Al-Dosari', team_id: 1218, jersey_no: 7, position: 'Midfielder', date_of_birth: '2002-01-05', status: 'pending' }
      ];
      
      // Approved players data
      const approvedPlayersData = [
        { player_id: 1001, name: 'Ahmed', team_id: 1214, jersey_no: 1, position: 'Goalkeeper', date_of_birth: '1999-03-10', status: 'approved', is_captain: true },
        { player_id: 1002, name: 'Mohammad', team_id: 1214, jersey_no: 2, position: 'Defender', date_of_birth: '1999-05-15', status: 'approved', is_captain: false },
        { player_id: 1003, name: 'Ali', team_id: 1214, jersey_no: 3, position: 'Defender', date_of_birth: '2000-02-20', status: 'approved', is_captain: false },
        { player_id: 1004, name: 'Saeed', team_id: 1215, jersey_no: 1, position: 'Goalkeeper', date_of_birth: '1998-07-05', status: 'approved', is_captain: true },
        { player_id: 1005, name: 'Khalid', team_id: 1215, jersey_no: 5, position: 'Midfielder', date_of_birth: '2001-01-30', status: 'approved', is_captain: false },
        { player_id: 1006, name: 'Omar', team_id: 1216, jersey_no: 10, position: 'Forward', date_of_birth: '1997-11-25', status: 'approved', is_captain: true },
        { player_id: 1007, name: 'Fahad', team_id: 1216, jersey_no: 7, position: 'Midfielder', date_of_birth: '1999-08-12', status: 'approved', is_captain: false },
        { player_id: 1008, name: 'Abdullah', team_id: 1217, jersey_no: 4, position: 'Defender', date_of_birth: '2000-04-18', status: 'approved', is_captain: false }
      ];
      
      setTeams(teamsData);
      setPendingPlayers(pendingPlayersData);
      setApprovedPlayers(approvedPlayersData);
      setLoading(false);
    }, 500);
  }, []);

  const approvePlayer = (playerId) => {
    // Find the player to approve
    const playerToApprove = pendingPlayers.find(player => player.player_id === playerId);
    if (!playerToApprove) return;
    
    // In a real app, this would be an API call
    
    // Update the player status to approved
    const updatedPlayer = {
      ...playerToApprove,
      status: 'approved',
      is_captain: false
    };
    
    // Add to approved players and remove from pending
    setApprovedPlayers(prev => [...prev, updatedPlayer]);
    setPendingPlayers(prev => prev.filter(player => player.player_id !== playerId));
    
    // Show success message
    setSuccessMessage(`${playerToApprove.name} has been approved to join ${getTeamName(playerToApprove.team_id)}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const rejectPlayer = (playerId) => {
    // Find the player to reject
    const playerToReject = pendingPlayers.find(player => player.player_id === playerId);
    if (!playerToReject) return;
    
    // In a real app, this would be an API call
    
    // Remove from pending
    setPendingPlayers(prev => prev.filter(player => player.player_id !== playerId));
    
    // Show success message
    setSuccessMessage(`${playerToReject.name}'s request to join ${getTeamName(playerToReject.team_id)} has been rejected`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Helper to get team name from team ID
  const getTeamName = (teamId) => {
    const team = teams.find(team => team.team_id === teamId);
    return team ? team.team_name : 'Unknown Team';
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Filter players by team
  const filteredPendingPlayers = teamFilter 
    ? pendingPlayers.filter(player => player.team_id === parseInt(teamFilter))
    : pendingPlayers;

  const filteredApprovedPlayers = teamFilter
    ? approvedPlayers.filter(player => player.team_id === parseInt(teamFilter))
    : approvedPlayers;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Player Management</h1>
        <p className="text-gray-600">Approve or reject player requests to join teams</p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Admin Dashboard</Link> /
          </li>
          <li className="ml-1">Players</li>
        </ol>
      </nav>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Team Filter */}
      <div className="mb-6 bg-white shadow-md rounded-lg overflow-hidden p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-800">Filter Players</h2>
          </div>
          <div className="w-full md:w-64">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pending Player Requests */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
          <h2 className="text-xl font-semibold text-gray-800">Pending Player Requests</h2>
          <p className="text-gray-600 text-sm mt-1">
            Players waiting to be approved to join teams
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jersey #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPendingPlayers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {teamFilter ? 'No pending requests for this team' : 'No pending player requests'}
                  </td>
                </tr>
              ) : (
                filteredPendingPlayers.map((player) => (
                  <tr key={player.player_id} className="hover:bg-yellow-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      <div className="text-xs text-gray-500">ID: {player.player_id}</div>
                      <div className="text-xs text-gray-500">DOB: {formatDate(player.date_of_birth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTeamName(player.team_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.jersey_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateAge(player.date_of_birth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => approvePlayer(player.player_id)} 
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectPlayer(player.player_id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Players */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-green-50 border-b border-green-100">
          <h2 className="text-xl font-semibold text-gray-800">Approved Players</h2>
          <p className="text-gray-600 text-sm mt-1">
            Players already approved to join teams
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jersey #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprovedPlayers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {teamFilter ? 'No approved players for this team' : 'No approved players'}
                  </td>
                </tr>
              ) : (
                filteredApprovedPlayers.map((player) => (
                  <tr key={player.player_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      <div className="text-xs text-gray-500">ID: {player.player_id}</div>
                      <div className="text-xs text-gray-500">DOB: {formatDate(player.date_of_birth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTeamName(player.team_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.jersey_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.is_captain ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Captain
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Player
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayers;
