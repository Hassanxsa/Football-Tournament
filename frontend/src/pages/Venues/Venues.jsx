import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { venueService } from '../../services/api';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [venueImages, setVenueImages] = useState({});
  const [matchesAtVenues, setMatchesAtVenues] = useState({});
  
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const searchParams = {};
        
        if (searchTerm) {
          searchParams.search = searchTerm;
        }
        
        if (filterStatus !== 'all') {
          searchParams.status = filterStatus;
        }
        
        const data = await venueService.getAllVenues(searchParams);
        setVenues(data);
        
        // Create venue images mapping
        const imageMapping = {};
        data.forEach((venue, index) => {
          // Assign images in a round-robin fashion
          const imageIndex = index % defaultImages.length;
          imageMapping[venue.venue_id] = defaultImages[imageIndex];
        });
        setVenueImages(imageMapping);
        
        // Create matches count mapping (in real app, this would come from API)
        const matchesMapping = {};
        data.forEach(venue => {
          // Generate random number of matches for demo purposes
          matchesMapping[venue.venue_id] = Math.floor(Math.random() * 10) + 1;
        });
        setMatchesAtVenues(matchesMapping);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError('Failed to load venues');
        setLoading(false);
      }
    };

    fetchVenues();
  }, [searchTerm, filterStatus]);
  
  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Default venue image placeholders
  const defaultImages = [
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521532863139-30e79ecb8e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601224335112-b74158e80c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

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
                Showing {venues.length} venues
              </span>
            </div>
          </div>
        </div>
        
        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
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
        {venues.length === 0 && !loading && (
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
