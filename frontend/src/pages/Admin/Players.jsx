import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playerService, teamService } from '../../services/api';

const AdminPlayers = () => {
  const [teams, setTeams] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [approvedPlayers, setApprovedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [teamFilter, setTeamFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch player requests data
        const response = await playerService.getPlayerRequests();
        
        if (response) {
          // Extract teams
          setTeams(response.teams || []);
          
          // Extract pending player requests
          const pendingRequests = response.pendingRequests || [];
          const formattedPendingRequests = pendingRequests.map(req => ({
            request_id: req.request_id,
            player_id: req.user_id,
            name: req.user_name,
            email: req.email,
            date_of_birth: req.date_of_birth,
            age: req.age,
            team_id: req.team_id,
            team_name: req.team_name,
            position: req.position,
            request_date: req.request_date,
            status: 'pending'
          }));
          setPendingPlayers(formattedPendingRequests);
          
          // Extract approved player requests
          const approvedRequests = response.approvedRequests || [];
          const formattedApprovedRequests = approvedRequests.map(req => ({
            request_id: req.request_id,
            player_id: req.user_id,
            name: req.user_name,
            email: req.email,
            date_of_birth: req.date_of_birth,
            age: req.age,
            team_id: req.team_id,
            team_name: req.team_name,
            position: req.position,
            request_date: req.request_date,
            processed_date: req.processed_date,
            status: 'approved'
          }));
          setApprovedPlayers(formattedApprovedRequests);
        } else {
          setError('Failed to retrieve player requests data');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const approvePlayer = async (requestId) => {
    try {
      setLoading(true);
      
      // Find the player request to approve
      const requestToApprove = pendingPlayers.find(player => player.request_id === requestId);
      if (!requestToApprove) {
        setError('Request not found');
        setLoading(false);
        return;
      }
      
      // Call API to approve the player request
      await playerService.approvePlayerRequest(requestId);
      
      // Update UI
      const approvedRequest = {
        ...requestToApprove,
        status: 'approved',
        processed_date: new Date().toISOString()
      };
      
      // Add to approved players and remove from pending
      setApprovedPlayers(prev => [...prev, approvedRequest]);
      setPendingPlayers(prev => prev.filter(player => player.request_id !== requestId));
      
      // Show success message
      setSuccessMessage(`${requestToApprove.name} has been approved to join ${requestToApprove.team_name}`);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error approving player:', err);
      setError('Failed to approve player. Please try again.');
      setLoading(false);
    }
  };

  const rejectPlayer = async (requestId) => {
    try {
      setLoading(true);
      
      // Find the player request to reject
      const requestToReject = pendingPlayers.find(player => player.request_id === requestId);
      if (!requestToReject) {
        setError('Request not found');
        setLoading(false);
        return;
      }
      
      // Call API to reject the player request
      await playerService.rejectPlayerRequest(requestId);
      
      // Remove from pending players
      setPendingPlayers(prev => prev.filter(player => player.request_id !== requestId));
      
      // Show success message
      setSuccessMessage(`${requestToReject.name}'s request has been rejected`);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error rejecting player:', err);
      setError('Failed to reject player. Please try again.');
      setLoading(false);
    }
  };

  // Helper to get team name from team ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.team_id === teamId);
    return team ? team.team_name : 'Unknown Team';
  };
  
  // Refresh data
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await playerService.getPlayerRequests();
      
      if (response) {
        // Update teams
        setTeams(response.teams || []);
        
        // Update pending requests
        const pendingRequests = response.pendingRequests || [];
        const formattedPendingRequests = pendingRequests.map(req => ({
          request_id: req.request_id,
          player_id: req.user_id,
          name: req.user_name,
          email: req.email,
          team_id: req.team_id,
          team_name: req.team_name,
          position: req.position,
          request_date: req.request_date,
          status: 'pending'
        }));
        setPendingPlayers(formattedPendingRequests);
        
        // Update approved requests
        const approvedRequests = response.approvedRequests || [];
        const formattedApprovedRequests = approvedRequests.map(req => ({
          request_id: req.request_id,
          player_id: req.user_id,
          name: req.user_name,
          email: req.email,
          team_id: req.team_id,
          team_name: req.team_name,
          position: req.position,
          request_date: req.request_date,
          processed_date: req.processed_date,
          status: 'approved'
        }));
        setApprovedPlayers(formattedApprovedRequests);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Check if the date string is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    // Check if dateOfBirth is valid
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return 'N/A';
    }
    
    const today = new Date();
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
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Player Approval Requests</h2>
            <p className="text-gray-600 text-sm mt-1">
              New player requests waiting for your approval
            </p>
          </div>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.team_name || getTeamName(player.team_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => approvePlayer(player.request_id)} 
                          className="text-green-600 hover:text-green-900"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => rejectPlayer(player.request_id)} 
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Reject'}
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.team_name || getTeamName(player.team_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position}
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
