import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TournamentList = () => {
  // In a real app, this would come from an API
  const [tournaments, setTournaments] = useState([
    { 
      tr_id: 1, 
      tr_name: 'Faculty Tournament', 
      start_date: '2023-03-01', 
      end_date: '2023-04-15',
      status: 'active',
      teamCount: 10
    },
    { 
      tr_id: 2, 
      tr_name: 'Open Tournament', 
      start_date: '2023-02-15', 
      end_date: '2023-04-30',
      status: 'active',
      teamCount: 8
    },
    { 
      tr_id: 3, 
      tr_name: 'Student Tournament', 
      start_date: '2023-02-01', 
      end_date: '2023-03-30',
      status: 'active',
      teamCount: 8
    },
    { 
      tr_id: 4, 
      tr_name: 'Summer Championship', 
      start_date: '2023-06-01', 
      end_date: '2023-08-15',
      status: 'upcoming',
      teamCount: 0
    }
  ]);

  const deleteTournament = (id) => {
    // In a real app, this would call an API
    setTournaments(tournaments.filter(tournament => tournament.tr_id !== id));
  };

  // Simplified status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tournament Management</h1>
          <p className="text-gray-600">Manage all tournaments in the system</p>
        </div>
        <Link 
          to="/admin/tournaments/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Create Tournament
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="ml-1">Tournaments</li>
        </ol>
      </nav>

      {/* Tournament List Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tournament Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teams
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tournaments.map(tournament => (
              <tr key={tournament.tr_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tournament.tr_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <Link 
                    to={`/admin/tournaments/${tournament.tr_id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {tournament.tr_name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusBadge status={tournament.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.teamCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link 
                      to={`/admin/tournaments/${tournament.tr_id}/edit`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/admin/tournaments/${tournament.tr_id}/teams`} 
                      className="text-green-600 hover:text-green-900"
                    >
                      Manage Teams
                    </Link>
                    <Link 
                      to={`/admin/tournaments/${tournament.tr_id}/matches`} 
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Matches
                    </Link>
                    <button 
                      onClick={() => deleteTournament(tournament.tr_id)} 
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

export default TournamentList;
