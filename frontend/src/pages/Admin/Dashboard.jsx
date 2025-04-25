import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage tournaments, teams, and players</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tournaments Management Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="ml-4 text-xl font-semibold text-gray-800">Tournaments</h2>
            </div>
            <p className="text-gray-600 mb-4">Add new tournaments, delete tournaments, manage teams for each tournament</p>
            <Link to="/admin/tournaments" className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300">
              Manage Tournaments
            </Link>
          </div>
        </div>

        {/* Teams Management Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="ml-4 text-xl font-semibold text-gray-800">Teams</h2>
            </div>
            <p className="text-gray-600 mb-4">Add teams to tournaments, assign team captains</p>
            <Link to="/admin/teams" className="block text-center py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300">
              Manage Teams
            </Link>
          </div>
        </div>

        {/* Players Management Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="ml-4 text-xl font-semibold text-gray-800">Players</h2>
            </div>
            <p className="text-gray-600 mb-4">Approve player requests to join teams</p>
            <Link to="/admin/players" className="block text-center py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-300">
              Manage Players
            </Link>
          </div>
        </div>
        
        {/* Project Information Card */}
      </div>
    </div>
  );
};

export default Dashboard;
