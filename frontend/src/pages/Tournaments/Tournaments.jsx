import React from 'react';
import { Link } from 'react-router-dom';

const Tournaments = () => {
  // Using dummy data based on the SQL schema
  const tournaments = [
    {
      tr_id: 1,
      tr_name: 'Faculty Tournament',
      start_date: '2023-03-10',
      end_date: '2023-03-25',
      status: 'Completed',
      teams: 4,
      matches: 6
    },
    {
      tr_id: 2,
      tr_name: 'Open Tournament',
      start_date: '2023-03-15',
      end_date: '2023-03-30',
      status: 'Active',
      teams: 6,
      matches: 9
    },
    {
      tr_id: 3,
      tr_name: 'Student Tournament',
      start_date: '2022-12-10',
      end_date: '2022-12-25',
      status: 'Completed',
      teams: 8,
      matches: 12
    },
    {
      tr_id: 4,
      tr_name: 'Staff Tournament',
      start_date: '2023-02-15',
      end_date: '2023-02-25',
      status: 'Completed',
      teams: 4,
      matches: 6
    },
    {
      tr_id: 5,
      tr_name: 'Annual Tournament',
      start_date: '2023-01-01',
      end_date: '2023-01-15',
      status: 'Completed',
      teams: 10,
      matches: 15
    },
    {
      tr_id: 6,
      tr_name: 'Summer Tournament',
      start_date: '2023-06-01',
      end_date: '2023-06-15',
      status: 'Upcoming',
      teams: 8,
      matches: 0
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Tournaments Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
          <p className="text-blue-200">View all football tournaments</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div 
              key={tournament.tr_id} 
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className={`p-4 text-white ${
                tournament.status === 'Active' 
                  ? 'bg-green-600' 
                  : tournament.status === 'Upcoming' 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-600'
              }`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{tournament.tr_name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-20">
                    {tournament.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium">{new Date(tournament.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium">{new Date(tournament.end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teams</p>
                    <p className="text-sm font-medium">{tournament.teams}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Matches</p>
                    <p className="text-sm font-medium">{tournament.matches}</p>
                  </div>
                </div>
                
                <Link 
                  to={`/tournaments/${tournament.tr_id}`} 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
