import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
    if (isEditMode) {
      // In a real app, this would fetch data from an API
      // Simulating API call with dummy data
      setTimeout(() => {
        // Based on our sample teams
        const teams = {
          '1214': 'CCM',
          '1215': 'KBS',
          '1216': 'CEP',
          '1217': 'CPG',
          '1218': 'CIE',
          '1219': 'MGE'
        };
        
        const teamData = {
          team_id: parseInt(id),
          team_name: teams[id] || 'Unknown Team',
          status: 'active'
        };
        
        setFormData(teamData);
        setLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.team_name.trim()) {
      setError('Team name is required');
      return;
    }
    
    setError(null);
    
    // In a real app, this would call an API to save the data
    console.log('Saving team:', formData);
    
    // Navigate back to team list
    navigate('/admin/teams');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Team' : 'Create Team'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update team details' : 'Add a new team to the system'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/teams" className="text-blue-600 hover:text-blue-800">Teams</Link> /
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
            <label htmlFor="team_name" className="block text-gray-700 font-medium mb-2">
              Team Name *
            </label>
            <input
              type="text"
              id="team_name"
              name="team_name"
              value={formData.team_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter team name (e.g., CCM, KBS)"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Use a short, recognizable name for the team.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/teams"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
