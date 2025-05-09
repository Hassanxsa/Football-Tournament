import React, { useState, useEffect } from 'react';
import { teamService } from '../services/api';

const RoleSelectionDialog = ({ isOpen, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('manager');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const teamsData = await teamService.getAllTeams();
          setTeams(teamsData);
          setError('');
        } catch (err) {
          console.error('Error fetching teams:', err);
          setError('Failed to load teams. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeams();
  }, [isOpen]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleTeamChange = (e) => {
    setSelectedTeamId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTeamId) {
      setError('Please select a team');
      return;
    }

    // In a real implementation, this would make a direct update to the backend
    const selectedTeam = teams.find(team => team.team_id.toString() === selectedTeamId);
    
    // For frontend-only implementation, just show success message
    setJoined(true);
    setSuccessMessage(`You have successfully joined as a ${role} for ${selectedTeam?.team_name || 'the selected team'}.`);
    
    // Clear form
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      setSelectedTeamId('');
      setRole('manager');
      setJoined(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-bold text-black" id="modal-title">
                  Join as Team Manager or Coach
                </h3>
                <div className="mt-4">
                  {successMessage ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                      {successMessage}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                          {error}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="role">
                          Select Role
                        </label>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center">
                            <input
                              id="manager"
                              name="role"
                              type="radio"
                              className="h-4 w-4 text-black focus:ring-black border-gray-300"
                              value="manager"
                              checked={role === 'manager'}
                              onChange={handleRoleChange}
                            />
                            <label htmlFor="manager" className="ml-2 block text-sm text-black">
                              Team Manager
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="coach"
                              name="role"
                              type="radio"
                              className="h-4 w-4 text-black focus:ring-black border-gray-300"
                              value="coach"
                              checked={role === 'coach'}
                              onChange={handleRoleChange}
                            />
                            <label htmlFor="coach" className="ml-2 block text-sm text-black">
                              Team Coach
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="team">
                          Select Team
                        </label>
                        {loading ? (
                          <div className="animate-pulse flex space-x-4">
                            <div className="h-10 bg-slate-200 rounded w-full"></div>
                          </div>
                        ) : (
                          <select
                            id="team"
                            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                          >
                            <option value="">-- Select a Team --</option>
                            {teams.map(team => (
                              <option key={team.team_id} value={team.team_id}>
                                {team.team_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm"
                        >
                          Join Team
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionDialog;
