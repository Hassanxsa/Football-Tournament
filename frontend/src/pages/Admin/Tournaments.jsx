import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../../services/api';

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    tr_name: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        // Use the admin service to get tournaments
        const response = await tournamentService.getAdminTournaments();
        console.log('Raw API response:', response);
        
        // The response might already be the data array (not wrapped in a data property)
        let tournaments = [];
        
        if (Array.isArray(response)) {
          // If response is already an array, use it directly
          tournaments = response;
        } else if (response && Array.isArray(response.data)) {
          // If response has a data property that's an array
          tournaments = response.data;
        } else if (response) {
          // Last resort - try to use the response itself
          tournaments = [response];
        }
        
        // Check data type and log for debugging
        console.log('Processed tournaments data:', tournaments);
        setTournaments(tournaments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError('Failed to load tournaments. Please try again.');
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTournament = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newTournament.tr_name || !newTournament.start_date || !newTournament.end_date) {
      setError('All fields are required');
      return;
    }
    
    // Check if end date is after start date
    if (new Date(newTournament.end_date) <= new Date(newTournament.start_date)) {
      setError('End date must be after start date');
      return;
    }
    
    // Add status to the tournament data
    const tournamentData = {
      ...newTournament,
      status: 'active'
    };
    
    try {
      // Call the API to create the tournament
      console.log('Sending tournament data:', tournamentData);
      const response = await tournamentService.createTournament(tournamentData);
      console.log('Tournament creation response:', response);
      
      // Refresh the tournament list
      const listResponse = await tournamentService.getAdminTournaments();
      console.log('Tournament list response:', listResponse);
      const tournaments = listResponse.data ? listResponse.data : [];
      setTournaments(Array.isArray(tournaments) ? tournaments : []);
      
      // Reset form and show success message
      setNewTournament({
        tr_name: '',
        start_date: '',
        end_date: ''
      });
      setError(null);
      setSuccessMessage('Tournament added successfully!');
    } catch (err) {
      console.error('Error creating tournament:', err);
      if (err.message === 'Unauthorized') {
        setError('Authentication error. Please log in again.');
      } else if (err.response && err.response.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(`Failed to create tournament: ${err.message || 'Unknown error'}`);
      }
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const deleteTournament = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      try {
        // Call the API to delete the tournament
        await tournamentService.deleteTournament(id);
        
        // Update the tournaments list by filtering out the deleted one
        setTournaments(prev => prev.filter(t => t.tr_id !== id));
        
        setSuccessMessage('Tournament deleted successfully!');
      } catch (err) {
        console.error('Error deleting tournament:', err);
        setError('Failed to delete tournament. Please try again.');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper function to determine tournament status based on dates and status field
  const getTournamentStatus = (tournament) => {
    const today = new Date();
    const startDate = tournament.start_date ? new Date(tournament.start_date) : null;
    const endDate = tournament.end_date ? new Date(tournament.end_date) : null;
    
    if (!startDate || !endDate) return 'unknown';
    
    // Normalize status to lowercase for comparison
    const statusLower = (tournament.status || '').toLowerCase();
    
    // If status is explicitly set to something meaningful, honor it
    if (statusLower === 'completed' || statusLower === 'cancelled') {
      return statusLower;
    }
    
    // Otherwise determine status based on dates
    if (today < startDate) {
      return 'upcoming';
    } else if (today > endDate) {
      return 'completed';
    } else {
      return 'active'; // Currently ongoing
    }
  };
  
  // Function to get the CSS class for status badge
  const getTournamentStatusClass = (tournament) => {
    const status = getTournamentStatus(tournament);
    
    switch(status) {
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to get the display label for status
  const getTournamentStatusLabel = (tournament) => {
    const status = getTournamentStatus(tournament);
    
    switch(status) {
      case 'active':
      case 'ongoing':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Tournament Management</h1>
        <p className="text-gray-600">Add and manage tournaments</p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Admin Dashboard</Link> /
          </li>
          <li className="ml-1">Tournaments</li>
        </ol>
      </nav>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Add Tournament Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Tournament</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={addTournament}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="tr_name" className="block text-gray-700 font-medium mb-2">
                Tournament Name *
              </label>
              <input
                type="text"
                id="tr_name"
                name="tr_name"
                value={newTournament.tr_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tournament name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="start_date" className="block text-gray-700 font-medium mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={newTournament.start_date}
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
                value={newTournament.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Tournament
            </button>
          </div>
        </form>
      </div>

      {/* Tournament List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Current Tournaments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournament
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tournaments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No tournaments found
                  </td>
                </tr>
              ) : (
                tournaments.map((tournament) => (
                  <tr key={tournament.tr_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tournament.tr_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${getTournamentStatusClass(tournament)}`}>
                        {getTournamentStatusLabel(tournament)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/admin/teams?tournament=${tournament.tr_id}`} 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Manage Teams
                      </Link>
                      <button 
                        onClick={() => deleteTournament(tournament.tr_id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTournaments;
