import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../../services/api';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await teamService.getAdminTeams();
        console.log('Teams data from API:', teamsData);
        
        if (Array.isArray(teamsData)) {
          setTeams(teamsData);
        } else if (teamsData && Array.isArray(teamsData.data)) {
          setTeams(teamsData.data);
        } else {
          console.error('Unexpected teams data format:', teamsData);
          setTeams([]);
          setError('Received unexpected data format from the server');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams: ' + (err.message || 'Unknown error'));
        setLoading(false);
        setTeams([]);
      }
    };
    
    fetchTeams();
  }, []);
  
  const deleteTeam = async (id, teamName) => {
    if (window.confirm(`Are you sure you want to delete ${teamName}? This action cannot be undone.`)) {
      try {
        await teamService.deleteTeam(id);
        setTeams(teams.filter(team => team.team_id !== id));
      } catch (err) {
        console.error('Error deleting team:', err);
        alert('Failed to delete team: ' + (err.message || 'Unknown error'));
      }
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredTeams = teams.filter(team => 
    team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
          <p className="text-gray-600">Manage all teams in the system</p>
        </div>
        <Link 
          to="/admin/teams/create" 
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Create Team
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="ml-1">Teams</li>
        </ol>
      </nav>

      {/* Team List Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading teams...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Players
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tournaments
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && filteredTeams.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No teams found. {searchTerm && 'Try adjusting your search.'}
                </td>
              </tr>
            )}
            {filteredTeams.map(team => (
              <tr key={team.team_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {team.team_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <Link 
                    to={`/admin/teams/${team.team_id}`} 
                    className="text-black hover:text-gray-800 font-medium"
                  >
                    {team.team_name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {team.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {team.num_players || 0}
                </td>
                <td className="px-6 py-4 text-sm text-black max-w-xs truncate">
                  {team.tournaments ? (
                    Array.isArray(team.tournaments) ? 
                      team.tournaments.join(', ') : 
                      String(team.tournaments)
                  ) : (
                    team.num_tournaments > 0 ? 
                      `${team.num_tournaments} tournament(s)` : 
                      'Not in any tournament'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link 
                      to={`/admin/teams/${team.team_id}/edit`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/admin/teams/${team.team_id}/players`} 
                      className="text-black hover:text-gray-800"
                    >
                      Players
                    </Link>
                    <button 
                      onClick={() => deleteTeam(team.team_id, team.team_name)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamList;
