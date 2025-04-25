import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const TournamentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    tr_name: '',
    start_date: '',
    end_date: '',
    status: 'upcoming'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would fetch data from an API
      // Simulating API call with dummy data
      setTimeout(() => {
        const tournamentData = {
          tr_id: parseInt(id),
          tr_name: id === '1' ? 'Faculty Tournament' : id === '2' ? 'Open Tournament' : 'Student Tournament',
          start_date: '2023-03-01',
          end_date: '2023-04-15',
          status: 'active'
        };
        setFormData(tournamentData);
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
    if (!formData.tr_name.trim()) {
      setError('Tournament name is required');
      return;
    }
    
    if (!formData.start_date) {
      setError('Start date is required');
      return;
    }
    
    if (!formData.end_date) {
      setError('End date is required');
      return;
    }
    
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('End date must be after start date');
      return;
    }
    
    setError(null);
    
    // In a real app, this would call an API to save the data
    console.log('Saving tournament:', formData);
    
    // Navigate back to tournament list
    navigate('/admin/tournaments');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Tournament' : 'Create Tournament'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update tournament details' : 'Add a new tournament to the system'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/tournaments" className="text-blue-600 hover:text-blue-800">Tournaments</Link> /
          </li>
          <li className="ml-1">{isEditMode ? 'Edit' : 'Create'}</li>
        </ol>
      </nav>

      {/* Tournament Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tr_name" className="block text-gray-700 font-medium mb-2">
              Tournament Name *
            </label>
            <input
              type="text"
              id="tr_name"
              name="tr_name"
              value={formData.tr_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start_date" className="block text-gray-700 font-medium mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-gray-700 font-medium mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/tournaments"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditMode ? 'Update Tournament' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm;
