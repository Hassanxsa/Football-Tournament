import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dummy data based on the schema
  const venues = [
    { venue_id: 11, venue_name: 'Main Stadium', venue_status: 'Y', venue_capacity: 20000 },
    { venue_id: 22, venue_name: 'Indoor Stadium', venue_status: 'Y', venue_capacity: 1000 },
    { venue_id: 33, venue_name: 'Jabal Field', venue_status: 'N', venue_capacity: 500 },
    { venue_id: 44, venue_name: 'Student Field', venue_status: 'Y', venue_capacity: 2000 }
  ];

  // Filter venues based on search term and status filter
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || venue.venue_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Venue images (placeholders)
  const venueImages = {
    11: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    22: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    33: 'https://images.unsplash.com/photo-1508024783999-6cf70fd10f5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    44: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  // Matches at venues
  const matchesAtVenues = {
    11: 2,
    22: 1,
    33: 1,
    44: 0
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/home" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
      
      {/* Venues Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Venues</h1>
          <p className="text-blue-200">Explore all tournament venues</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Venues
              </label>
              <input
                type="text"
                id="search"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status-filter"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Venues</option>
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <span className="text-sm text-gray-500">
                Showing {filteredVenues.length} out of {venues.length} venues
              </span>
            </div>
          </div>
        </div>
        
        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <div key={venue.venue_id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative h-48 bg-blue-50">
                <img 
                  src={venueImages[venue.venue_id]} 
                  alt={venue.venue_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    venue.venue_status === 'Y' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {venue.venue_status === 'Y' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">{venue.venue_name}</h3>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Capacity:</span> {venue.venue_capacity.toLocaleString()} spectators
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Matches:</span> {matchesAtVenues[venue.venue_id]} matches hosted
                  </p>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <span className="text-sm font-medium text-blue-700">Venue ID</span>
                    <p className="text-lg font-bold text-blue-900">{venue.venue_id}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <span className="text-sm font-medium text-green-700">Utilization</span>
                    <p className="text-lg font-bold text-green-900">
                      {matchesAtVenues[venue.venue_id] > 0 ? '✓' : '—'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/venues/${venue.venue_id}`} 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No venues found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
