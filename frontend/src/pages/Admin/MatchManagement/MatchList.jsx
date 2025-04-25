import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tournamentFilter, setTournamentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // List of tournaments for filtering
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch matches and tournaments
    setTimeout(() => {
      // Dummy tournaments data
      const tournamentsData = [
        { tr_id: 1, tr_name: 'Faculty Tournament' },
        { tr_id: 2, tr_name: 'Open Tournament' },
        { tr_id: 3, tr_name: 'Student Tournament' }
      ];
      
      // Dummy matches data
      const matchesData = [
        { 
          match_id: 1001, 
          match_no: 1, 
          tr_id: 1, 
          tournament_name: 'Faculty Tournament',
          play_stage: 'G', 
          play_date: '2023-03-11', 
          team1_id: 1214, 
          team1_name: 'CCM', 
          team1_score: 3, 
          team2_id: 1215,
          team2_name: 'KBS',
          team2_score: 1,
          venue_id: 1,
          venue_name: 'Stadium 1',
          status: 'completed'
        },
        { 
          match_id: 1002, 
          match_no: 2, 
          tr_id: 1, 
          tournament_name: 'Faculty Tournament',
          play_stage: 'G', 
          play_date: '2023-03-12', 
          team1_id: 1216, 
          team1_name: 'CEP', 
          team1_score: 2, 
          team2_id: 1217,
          team2_name: 'CPG',
          team2_score: 2,
          venue_id: 2,
          venue_name: 'Stadium 2',
          status: 'completed'
        },
        { 
          match_id: 1003, 
          match_no: 3, 
          tr_id: 1, 
          tournament_name: 'Faculty Tournament',
          play_stage: 'G', 
          play_date: '2023-03-15', 
          team1_id: 1214, 
          team1_name: 'CCM', 
          team1_score: 2, 
          team2_id: 1216,
          team2_name: 'CEP',
          team2_score: 0,
          venue_id: 1,
          venue_name: 'Stadium 1',
          status: 'completed'
        },
        { 
          match_id: 1004, 
          match_no: 4, 
          tr_id: 2, 
          tournament_name: 'Open Tournament',
          play_stage: 'G', 
          play_date: '2023-03-16', 
          team1_id: 1214, 
          team1_name: 'CCM', 
          team1_score: 1, 
          team2_id: 1218,
          team2_name: 'CIE',
          team2_score: 0,
          venue_id: 3,
          venue_name: 'Stadium 3',
          status: 'completed'
        },
        { 
          match_id: 1005, 
          match_no: 5, 
          tr_id: 2, 
          tournament_name: 'Open Tournament',
          play_stage: 'G', 
          play_date: '2023-03-18', 
          team1_id: 1215, 
          team1_name: 'KBS', 
          team1_score: 3, 
          team2_id: 1219,
          team2_name: 'MGE',
          team2_score: 1,
          venue_id: 1,
          venue_name: 'Stadium 1',
          status: 'completed'
        },
        { 
          match_id: 1006, 
          match_no: 6, 
          tr_id: 3, 
          tournament_name: 'Student Tournament',
          play_stage: 'G', 
          play_date: '2023-03-19', 
          team1_id: 1217, 
          team1_name: 'CPG', 
          team1_score: 2, 
          team2_id: 1218,
          team2_name: 'CIE',
          team2_score: 3,
          venue_id: 2,
          venue_name: 'Stadium 2',
          status: 'completed'
        },
        { 
          match_id: 1007, 
          match_no: 7, 
          tr_id: 1, 
          tournament_name: 'Faculty Tournament',
          play_stage: 'G', 
          play_date: '2023-03-25', 
          team1_id: 1218, 
          team1_name: 'CIE', 
          team1_score: null, 
          team2_id: 1219,
          team2_name: 'MGE',
          team2_score: null,
          venue_id: 3,
          venue_name: 'Stadium 3',
          status: 'scheduled'
        },
        { 
          match_id: 1008, 
          match_no: 8, 
          tr_id: 2, 
          tournament_name: 'Open Tournament',
          play_stage: 'G', 
          play_date: '2023-03-26', 
          team1_id: 1216, 
          team1_name: 'CEP', 
          team1_score: null, 
          team2_id: 1217,
          team2_name: 'CPG',
          team2_score: null,
          venue_id: 1,
          venue_name: 'Stadium 1',
          status: 'scheduled'
        },
        { 
          match_id: 1009, 
          match_no: 9, 
          tr_id: 3, 
          tournament_name: 'Student Tournament',
          play_stage: 'G', 
          play_date: '2023-03-30', 
          team1_id: 1214, 
          team1_name: 'CCM', 
          team1_score: null, 
          team2_id: 1215,
          team2_name: 'KBS',
          team2_score: null,
          venue_id: 2,
          venue_name: 'Stadium 2',
          status: 'scheduled'
        },
        { 
          match_id: 1010, 
          match_no: 10, 
          tr_id: 1, 
          tournament_name: 'Faculty Tournament',
          play_stage: 'G', 
          play_date: '2023-04-02', 
          team1_id: 1214, 
          team1_name: 'CCM', 
          team1_score: null, 
          team2_id: 1219,
          team2_name: 'MGE',
          team2_score: null,
          venue_id: 3,
          venue_name: 'Stadium 3',
          status: 'scheduled'
        }
      ];
      
      setTournaments(tournamentsData);
      setMatches(matchesData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter matches based on filters
  const filteredMatches = matches.filter(match => {
    const matchesTournament = tournamentFilter ? match.tr_id === parseInt(tournamentFilter) : true;
    const matchesStatus = statusFilter ? match.status === statusFilter : true;
    const matchesSearch = searchTerm ? 
      match.team1_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      match.team2_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament_name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    return matchesTournament && matchesStatus && matchesSearch;
  });

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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Match Management</h1>
          <p className="text-gray-600">Schedule and manage matches across all tournaments</p>
        </div>
        <Link 
          to="/admin/matches/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Schedule New Match
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="ml-1">Matches</li>
        </ol>
      </nav>

      {/* Filters */}
      <div className="mb-6 bg-white shadow-md rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search teams, venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="tournament" className="block text-sm font-medium text-gray-700 mb-1">Tournament</label>
            <select
              id="tournament"
              value={tournamentFilter}
              onChange={(e) => setTournamentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tournaments</option>
              {tournaments.map(tournament => (
                <option key={tournament.tr_id} value={tournament.tr_id}>
                  {tournament.tr_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournament
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teams
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No matches found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredMatches.map(match => (
                  <tr key={match.match_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Match #{match.match_no}</div>
                      <div className="text-xs text-gray-500">{formatDate(match.play_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/tournaments/${match.tr_id}`} className="text-sm text-blue-600 hover:text-blue-900">
                        {match.tournament_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-gray-900">
                        <Link to={`/admin/teams/${match.team1_id}`} className="text-blue-600 hover:text-blue-900">
                          {match.team1_name}
                        </Link> 
                        <span className="text-xs text-gray-500 my-1">vs</span>
                        <Link to={`/admin/teams/${match.team2_id}`} className="text-blue-600 hover:text-blue-900">
                          {match.team2_name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.status === 'completed' ? (
                        <span className="font-medium">{match.team1_score} - {match.team2_score}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/venues/${match.venue_id}`} className="text-sm text-green-600 hover:text-green-900">
                        {match.venue_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${match.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/admin/matches/${match.match_id}/edit`} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        {match.status === 'scheduled' && (
                          <Link 
                            to={`/admin/matches/${match.match_id}/record`} 
                            className="text-green-600 hover:text-green-900"
                          >
                            Record Result
                          </Link>
                        )}
                        {match.status === 'scheduled' && (
                          <button className="text-red-600 hover:text-red-900">
                            Cancel
                          </button>
                        )}
                      </div>
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

export default MatchList;
