import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../../services/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentService.getAllTournaments();
        setTournaments(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError('Failed to load tournaments');
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

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

        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600">Loading tournaments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No tournaments found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div 
                key={tournament.tr_id} 
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className={`p-4 text-white ${
                  tournament.status === 'active' 
                    ? 'bg-green-600' 
                    : tournament.status === 'upcoming' 
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
                      <p className="text-sm font-medium">{tournament.num_teams || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Matches</p>
                      <p className="text-sm font-medium">{tournament.num_matches || 0}</p>
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
        )}
      </div>
    </div>
  );
};

export default Tournaments;
