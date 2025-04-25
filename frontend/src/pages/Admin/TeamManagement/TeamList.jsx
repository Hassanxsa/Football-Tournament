import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TeamList = () => {
  // In a real app, this would come from an API
  const [teams, setTeams] = useState([
    { team_id: 1214, team_name: 'CCM', status: 'active', player_count: 15, tournaments: ['Faculty Tournament', 'Student Tournament', 'Open Tournament'] },
    { team_id: 1215, team_name: 'KBS', status: 'active', player_count: 13, tournaments: ['Faculty Tournament', 'Student Tournament'] },
    { team_id: 1216, team_name: 'CEP', status: 'active', player_count: 14, tournaments: ['Faculty Tournament', 'Open Tournament'] },
    { team_id: 1217, team_name: 'CPG', status: 'active', player_count: 12, tournaments: ['Faculty Tournament', 'Student Tournament', 'Open Tournament'] },
    { team_id: 1218, team_name: 'CIE', status: 'active', player_count: 16, tournaments: ['Faculty Tournament'] },
    { team_id: 1219, team_name: 'MGE', status: 'active', player_count: 14, tournaments: ['Faculty Tournament'] },
    { team_id: 1220, team_name: 'CHE', status: 'active', player_count: 15, tournaments: ['Faculty Tournament'] },
    { team_id: 1221, team_name: 'ARC', status: 'active', player_count: 13, tournaments: ['Faculty Tournament'] },
    { team_id: 1222, team_name: 'COE', status: 'active', player_count: 12, tournaments: ['Faculty Tournament'] },
    { team_id: 1223, team_name: 'ICS', status: 'active', player_count: 14, tournaments: ['Faculty Tournament'] },
  ]);

  const deleteTeam = (id) => {
    // In a real app, this would call an API
    setTeams(teams.filter(team => team.team_id !== id));
  };

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
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
            {teams.map(team => (
              <tr key={team.team_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {team.team_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <Link 
                    to={`/admin/teams/${team.team_id}`} 
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {team.team_name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {team.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.player_count}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {team.tournaments.join(', ')}
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
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Players
                    </Link>
                    <button 
                      onClick={() => deleteTeam(team.team_id)} 
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
