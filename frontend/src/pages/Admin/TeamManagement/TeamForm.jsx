import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teamService } from '../../../services/api';

const TeamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    team_name: '',
    status: 'active'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const teamData = await teamService.getTeamById(id);
          console.log('Team data from API:', teamData);
          
          if (teamData) {
            setFormData({
              team_id: teamData.team_id,
              team_name: teamData.team_name,
              status: teamData.status || 'active'
            });
          } else {
            setError('Team not found');
          }
        } catch (err) {
          console.error('Error fetching team data:', err);
          setError('Failed to load team data: ' + (err.message || 'Unknown error'));
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTeamData();
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.team_name.trim()) {
      setError('Team name is required');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      if (isEditMode) {
        // Update existing team
        await teamService.updateTeam(id, formData);
      } else {
        // Create new team
        await teamService.createTeam(formData);
      }
      
      // Navigate back to team list
      navigate('/admin/teams');
    } catch (err) {
      console.error('Error saving team:', err);
      setError('Failed to save team: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-medium">{isEditMode ? 'Loading team data...' : 'Creating team...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">
          {isEditMode ? 'Edit Team' : 'Create Team'}
        </h1>
        <p className="text-black">
          {isEditMode ? 'Update team details' : 'Add a new team to the system'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-black">
          <li className="mr-1">
            <Link to="/admin" className="text-black hover:text-gray-800 font-medium">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/teams" className="text-black hover:text-gray-800 font-medium">Teams</Link> /
          </li>
          <li className="ml-1">{isEditMode ? 'Edit' : 'Create'}</li>
        </ol>
      </nav>

      {/* Team Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="team_name" className="block text-black font-medium mb-2">
              Team Name *
            </label>
            <input
              type="text"
              id="team_name"
              name="team_name"
              value={formData.team_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="Enter team name (e.g., CCM, KBS)"
              required
            />
            <p className="mt-1 text-sm text-black">
              Use a short, recognizable name for the team.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-black font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/teams"
              className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            >
              {isEditMode ? 'Update Team' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
