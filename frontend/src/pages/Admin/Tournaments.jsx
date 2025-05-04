import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    // In a real app, this would be an API call
    setTimeout(() => {
      const tournamentsData = [
        { tr_id: 1, tr_name: 'Faculty Tournament', start_date: '2023-03-01', end_date: '2023-04-15', status: 'active' },
        { tr_id: 2, tr_name: 'Open Tournament', start_date: '2023-03-05', end_date: '2023-04-20', status: 'active' },
        { tr_id: 3, tr_name: 'Student Tournament', start_date: '2023-03-10', end_date: '2023-04-25', status: 'active' }
      ];
      setTournaments(tournamentsData);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTournament = (e) => {
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
    
    // In a real app, this would be an API call
    // Add tournament with new ID and active status
    const newId = Math.max(...tournaments.map(t => t.tr_id), 0) + 1;
    const tournamentToAdd = {
      tr_id: newId,
      ...newTournament,
      status: 'active'
    };
    
    setTournaments(prev => [...prev, tournamentToAdd]);
    
    // Reset form and show success message
    setNewTournament({
      tr_name: '',
      start_date: '',
      end_date: ''
    });
    setError(null);
    setSuccessMessage('Tournament added successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const deleteTournament = (id) => {
    if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      // In a real app, this would be an API call
      setTournaments(prev => prev.filter(t => t.tr_id !== id));
      
      setSuccessMessage('Tournament deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                      <div className="text-xs text-gray-500">ID: {tournament.tr_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${tournament.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {tournament.status === 'active' ? 'Active' : 'Inactive'}
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
