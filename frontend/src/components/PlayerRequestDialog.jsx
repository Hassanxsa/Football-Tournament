import React, { useState, useEffect } from 'react';
import { teamService, playerService } from '../services/api';

const PlayerRequestDialog = ({ isOpen, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([
    { id: 'FW', name: 'Forward' },
    { id: 'MF', name: 'Midfielder' },
    { id: 'DF', name: 'Defender' },
    { id: 'GK', name: 'Goalkeeper' }
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    teamId: '',
    position: '',
    jerseyNo: ''
  });
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await teamService.getAllTeams();
        setTeams(Array.isArray(response) ? response : []);
        
        // Set default value for teamId if teams are available
        if (response && response.length > 0) {
          setFormData(prev => ({
            ...prev,
            teamId: response[0].team_id
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.teamId || !formData.position || !formData.jerseyNo) {
      setError('Please select a team, position, and jersey number.');
      return;
    }
    
    // Validate jersey number is between 1-99
    const jerseyNumber = parseInt(formData.jerseyNo);
    if (isNaN(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 99) {
      setError('Jersey number must be between 1 and 99.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      await playerService.submitPlayerRequest(formData);
      
      // Get current user ID from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Mark request as sent in localStorage with user-specific key
          localStorage.setItem(`playerRequestSent-${user.id}`, 'true');
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
      
      setSuccess(true);
      setSubmitting(false);
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
        // Reload the page to update the navbar button state
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting player request:', err);
      setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
      setSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Request to be a Player</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : success ? (
          <div className="text-center py-10">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              Your request has been submitted successfully! An admin will review your request.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teamId">
                Team
              </label>
              <select
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={submitting}
              >
                {teams.length === 0 ? (
                  <option value="">No teams available</option>
                ) : (
                  teams.map(team => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                Position
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={submitting}
              >
                <option value="">Select a position</option>
                {positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jerseyNo">
                Jersey Number
              </label>
              <input
                id="jerseyNo"
                name="jerseyNo"
                type="number"
                min="1"
                max="99"
                value={formData.jerseyNo}
                onChange={handleChange}
                placeholder="Enter your preferred jersey number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={submitting}
              />
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlayerRequestDialog;
