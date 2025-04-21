import React from 'react';
import { Link } from 'react-router-dom';

const TeamsSection = () => {
  // Using dummy data based on the provided SQL schema
  const teams = [
    { team_id: 1214, team_name: 'CCM' },
    { team_id: 1215, team_name: 'KBS' },
    { team_id: 1216, team_name: 'CEP' },
    { team_id: 1217, team_name: 'CPG' },
    { team_id: 1219, team_name: 'CDB' },
    { team_id: 1220, team_name: 'CGS' }
  ];

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Participating Teams</h2>
        <Link to="/teams/1214" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Teams →
        </Link>
      </div>
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
    </div>
  );
};

export default TeamsSection;
