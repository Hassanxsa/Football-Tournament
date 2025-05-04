import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeService } from '../../../services/api';

const TeamsSection = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await homeService.getHomeData();
        setTeams(data.participatingTeams || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams');
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Participating Teams</h2>
        <Link to="/teams" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Teams →
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading teams...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : teams.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No participating teams found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div 
              key={team.team_id} 
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{team.team_name}</h3>
                  <p className="text-sm text-gray-500">Team ID: {team.team_id}</p>
                  <Link to={`/teams/${team.team_id}`} className="mt-2 text-sm text-blue-600 hover:text-blue-800">View Team Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsSection;
