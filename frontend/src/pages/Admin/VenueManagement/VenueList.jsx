import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, this would be fetched from an API
    // Simulating API call with dummy data
    setTimeout(() => {
      const venuesData = [
        { 
          venue_id: 1, 
          venue_name: 'Stadium 1', 
          city: 'Dhahran', 
          capacity: 5000,
          status: 'active',
          matches_count: 12
        },
        { 
          venue_id: 2, 
          venue_name: 'Stadium 2', 
          city: 'Dhahran', 
          capacity: 3000,
          status: 'active',
          matches_count: 8
        },
        { 
          venue_id: 3, 
          venue_name: 'Stadium 3', 
          city: 'Dhahran', 
          capacity: 2000,
          status: 'active',
          matches_count: 10
        },
        { 
          venue_id: 4, 
          venue_name: 'Training Ground A', 
          city: 'Dhahran', 
          capacity: 1000,
          status: 'active',
          matches_count: 5
        },
        { 
          venue_id: 5, 
          venue_name: 'Training Ground B', 
          city: 'Dhahran', 
          capacity: 800,
          status: 'inactive',
          matches_count: 0
        }
      ];
      
      setVenues(venuesData);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (id) => {
    // In a real app, this would call an API to delete the venue
    if (window.confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter(venue => venue.venue_id !== id));
    }
  };

  // Filter venues based on search term
  const filteredVenues = venues.filter(venue => 
    venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Venue Management</h1>
          <p className="text-gray-600">Manage all venues for tournaments and matches</p>
        </div>
        <Link 
          to="/admin/venues/create" 
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Add New Venue
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="ml-1">Venues</li>
        </ol>
      </nav>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Venues</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Venue List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matches
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No venues found
                </td>
              </tr>
            ) : (
              filteredVenues.map((venue) => (
                <tr key={venue.venue_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{venue.venue_name}</div>
                    <div className="text-xs text-gray-500">ID: {venue.venue_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {venue.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {venue.capacity.toLocaleString()} seats
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {venue.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {venue.matches_count} {venue.matches_count === 1 ? 'match' : 'matches'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/admin/venues/${venue.venue_id}`} 
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/admin/venues/${venue.venue_id}/edit`} 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(venue.venue_id)} 
                      className={`text-red-600 hover:text-red-900 ${venue.matches_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={venue.matches_count > 0}
                      title={venue.matches_count > 0 ? "Cannot delete venue with scheduled matches" : "Delete venue"}
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

      {/* Help text */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Venues with scheduled matches cannot be deleted.</p>
      </div>
    </div>
  );
};

export default VenueList;
