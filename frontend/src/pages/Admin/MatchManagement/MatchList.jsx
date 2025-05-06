import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tournamentService, matchService } from '../../../services/api';

const MatchList = () => {
  const { trId } = useParams(); // If we're showing matches for a specific tournament
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentFilter, setTournamentFilter] = useState(trId || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // List of tournaments for filtering
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch tournaments list
        const tournamentsData = await tournamentService.getAllTournaments();
        setTournaments(tournamentsData);
        
        // Fetch matches
        let matchesData = [];
        if (trId) {
          // If tournament ID is provided, fetch matches for that tournament
          matchesData = await matchService.getTournamentMatches(trId);
        } else {
          // Fetch all matches across tournaments
          matchesData = [];
          for (const tournament of tournamentsData) {
            try {
              const tournamentMatches = await matchService.getTournamentMatches(tournament.tr_id);
              matchesData.push(...tournamentMatches);
            } catch (err) {
              console.error(`Error fetching matches for tournament ${tournament.tr_id}:`, err);
            }
          }
        }
        
        setMatches(matchesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load matches. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trId]);

  // Filter matches based on tournament, status, and search term
  const filteredMatches = matches.filter(match => {
    // Filter by tournament
    if (tournamentFilter && match.tr_id !== parseInt(tournamentFilter)) {
      return false;
    }
    
    // Filter by status (if implemented in your data model)
    if (statusFilter && match.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term (team names, venue, etc.)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        match.team1_name?.toLowerCase().includes(term) ||
        match.team2_name?.toLowerCase().includes(term) ||
        match.venue_name?.toLowerCase().includes(term) ||
        (match.tournament_name && match.tournament_name.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  // Handle tournament filter change
  const handleTournamentFilterChange = (e) => {
    setTournamentFilter(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get stage name from code
  const getStageName = (stageCode) => {
    // Since we're only using a points league system, all matches are league matches
    return 'League Match';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{trId ? 'Tournament Matches' : 'All Matches'}</h1>
        <Link
          to={trId ? `/admin/tournaments/${trId}/matches/new` : "/admin/matches/new"}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Schedule New Match
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tournament Filter (only show if not already filtered by tournament) */}
          {!trId && (
            <div>
              <label htmlFor="tournamentFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Tournament
              </label>
              <select
                id="tournamentFilter"
                value={tournamentFilter}
                onChange={handleTournamentFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tournaments</option>
                {tournaments.map(tournament => (
                  <option key={tournament.tr_id} value={tournament.tr_id}>
                    {tournament.tr_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search teams, venues..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredMatches.map((match) => (
              <li key={match.match_no}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <p className="text-sm font-medium text-blue-600 truncate mr-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          {getStageName(match.play_stage)}
                        </span>
                        {formatDate(match.play_date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Venue:</span> {match.venue_name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/matches/${match.match_no}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/matches/${match.match_no}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:items-center bg-gray-50 p-3 rounded-md w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center w-5/12 justify-end">
                          <span className="text-lg font-bold">{match.team1_name}</span>
                        </div>
                        
                        <div className="flex items-center justify-center w-2/12">
                          <div className="bg-white px-4 py-2 rounded-md shadow-sm">
                            <span className="text-xl font-bold">{match.goal_score || '0-0'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center w-5/12">
                          <span className="text-lg font-bold">{match.team2_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchList;
