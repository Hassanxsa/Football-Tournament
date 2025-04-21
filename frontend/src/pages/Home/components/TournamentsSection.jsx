import React from 'react';
import { Link } from 'react-router-dom';

const TournamentsSection = () => {
  // Using dummy data based on the SQL schema
  const tournaments = [
    {
      tr_id: 1,
      tr_name: 'Faculty Tournament',
      start_date: '2023-03-10',
      end_date: '2023-03-25'
    },
    {
      tr_id: 2,
      tr_name: 'Open Tournament',
      start_date: '2023-03-15',
      end_date: '2023-03-30'
    },
    {
      tr_id: 3,
      tr_name: 'Student Tournament',
      start_date: '2022-12-10',
      end_date: '2022-12-25'
    },
    {
      tr_id: 5,
      tr_name: 'Annual Tournament',
      start_date: '2023-01-01',
      end_date: '2023-01-15'
    }
  ];

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Active Tournaments</h2>
        <Link to="/tournaments/1" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Tournaments →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tournaments.map((tournament) => (
              <tr key={tournament.tr_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tournament.tr_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.tr_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.start_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.end_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/tournaments/${tournament.tr_id}`} className="text-blue-600 hover:text-blue-900 mr-3">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentsSection;
