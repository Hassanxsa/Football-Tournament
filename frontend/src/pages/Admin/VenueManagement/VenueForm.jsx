import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const VenueForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    venue_name: '',
    city: 'Dhahran',
    capacity: '',
    status: 'active'
  });

  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would fetch data from an API
      // Simulating API call with dummy data
      setTimeout(() => {
        // Map venue IDs to names for our dummy data
        const venues = {
          '1': { venue_name: 'Stadium 1', city: 'Dhahran', capacity: 5000, status: 'active' },
          '2': { venue_name: 'Stadium 2', city: 'Dhahran', capacity: 3000, status: 'active' },
          '3': { venue_name: 'Stadium 3', city: 'Dhahran', capacity: 2000, status: 'active' },
          '4': { venue_name: 'Training Ground A', city: 'Dhahran', capacity: 1000, status: 'active' },
          '5': { venue_name: 'Training Ground B', city: 'Dhahran', capacity: 800, status: 'inactive' }
        };
        
        const venueData = venues[id] || {
          venue_name: 'Unknown Venue',
          city: 'Dhahran',
          capacity: 1000,
          status: 'active'
        };
        
        setFormData(venueData);
        setLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? (value === '' ? '' : parseInt(value)) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.venue_name.trim()) {
      setError('Venue name is required');
      return;
    }
    
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    
    if (!formData.capacity) {
      setError('Capacity is required');
      return;
    }
    
    if (isNaN(parseInt(formData.capacity)) || parseInt(formData.capacity) <= 0) {
      setError('Capacity must be a positive number');
      return;
    }
    
    setError(null);
    
    // In a real app, this would call an API to save the data
    console.log('Saving venue:', formData);
    
    // Navigate back to venue list
    navigate('/admin/venues');
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
          {isEditMode ? 'Edit Venue' : 'Add New Venue'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update venue details' : 'Create a new venue for matches'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/venues" className="text-blue-600 hover:text-blue-800">Venues</Link> /
          </li>
          <li className="ml-1">{isEditMode ? 'Edit' : 'Add'}</li>
        </ol>
      </nav>

      {/* Venue Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="venue_name" className="block text-gray-700 font-medium mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              id="venue_name"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter venue name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter city name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="capacity" className="block text-gray-700 font-medium mb-2">
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter seating capacity"
              min="1"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Maximum number of spectators</p>
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
            <p className="mt-1 text-sm text-gray-500">Inactive venues cannot be selected for new matches</p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/venues"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {isEditMode ? 'Update Venue' : 'Create Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueForm;
