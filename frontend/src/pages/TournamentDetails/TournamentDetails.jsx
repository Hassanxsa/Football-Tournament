import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tournamentService } from '../../services/api';
import LeagueStandings from './LeagueStandings';

const TournamentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to generate mock standings data based on real teams
  const generateMockStandings = (teamsList) => {
    if (!Array.isArray(teamsList) || teamsList.length === 0) return [];
    
    return teamsList.map((team, index) => {
      // Generate random but realistic stats
      const played = 10 + Math.floor(Math.random() * 6); // 10-15 games played
      const won = Math.floor(Math.random() * (played - 2)) + 1; // 1 to (played-2) wins
      const drawn = Math.floor(Math.random() * (played - won)); // 0 to (played-won) draws
      const lost = played - won - drawn; // Remaining games are losses
      
      const goalsFor = won * 2 + drawn + Math.floor(Math.random() * 10); // Approximate goals scored
      const goalsAgainst = lost * 2 + drawn + Math.floor(Math.random() * 8); // Approximate goals conceded
      
      return {
        ...team,
        match_played: played,
        won,
        drawn,
        lost,
        goals_for: goalsFor,
        goals_against: goalsAgainst,
        goal_difference: goalsFor - goalsAgainst,
        points: won * 3 + drawn
      };
    }).sort((a, b) => {
      // Sort by points, then goal difference, then goals scored
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      return b.goals_for - a.goals_for;
    });
  };
  
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch tournament details
        const tournamentData = await tournamentService.getTournamentById(id);
        setTournament(tournamentData);
        
        // Fetch teams participating in this tournament
        const teamsData = await tournamentService.getTournamentTeams(id);
        
        // Generate mock standings data from real teams
        const teamsWithStandings = generateMockStandings(teamsData);
        setTeams(teamsWithStandings);
        
        // Fetch matches for this tournament
        const matchesData = await tournamentService.getTournamentMatches(id);
        setMatches(matchesData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournament details:', err);
        setError('Failed to load tournament details');
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);
  
  // If loading or error, show appropriate UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tournament Not Found</h2>
          <p className="text-gray-600">The tournament you are looking for does not exist or has been removed.</p>
          <Link 
            to="/tournaments" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            View All Tournaments
          </Link>
        </div>
      </div>
    );
  }

  // Since team_group column has been removed, we'll use a single league table
  const groups = [];

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'G': return 'Group Stage';
      case 'R': return 'Round of 16';
      case 'Q': return 'Quarter Final';
      case 'S': return 'Semi Final';
      case 'F': return 'Final';
      default: return stage;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-blue-700 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/tournaments" className="flex items-center text-white hover:text-blue-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tournaments
          </Link>
        </div>
      </div>
      
      {/* Tournament Header */}
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tournament.tr_name}</h1>
          <p className="text-blue-200">
            {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tournament Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-4 px-1 ${activeTab === 'matches' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Matches
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-1 ${activeTab === 'teams' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Teams
              </button>
              <button
                onClick={() => setActiveTab('standings')}
                className={`py-4 px-1 ${activeTab === 'standings' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Standings
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div>
            {/* Tournament Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tournament Details</h3>
                <dl>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Name:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{tournament.tr_name}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Start Date:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{new Date(tournament.start_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">End Date:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{new Date(tournament.end_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Teams:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{teams.length}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Matches:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{matches.length}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Matches</h3>
                {Array.isArray(matches) && matches.length > 0 ? matches.slice(0, 3).map((match, index) => (
                  <div key={match.match_no || index} className="mb-3 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{match.team_name1}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {match.status === 'completed' ? match.goal_score : 'vs'}
                      </span>
                      <span className="text-sm font-medium">{match.team_name2}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{new Date(match.play_date).toLocaleDateString()}</span>
                      <span>{match.venue_name}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500">No matches available</p>}
                <div className="mt-4">
                  <button 
                    onClick={() => setActiveTab('matches')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all matches →
                  </button>
                </div>
              </div>
              

            </div>
            

          </div>
        )}
        
        {activeTab === 'matches' && (
          <div>
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tournament Matches</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {Array.isArray(matches) && matches.length > 0 ? 
                  matches
                    .sort((a, b) => new Date(b.play_date) - new Date(a.play_date)) // Latest matches first
                    .map((match, index) => (
                      <div key={match.match_no || index} className="p-4 border border-gray-200 rounded-lg mb-3">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm text-gray-500">
                            {new Date(match.play_date).toLocaleDateString()} · Match {match.match_no} · {match.venue_name}
                          </div>
                          <div className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                            {match.results === 'N/A' ? 'Scheduled' : 'Completed'}
                          </div>
                        </div>
                        
                        {/* Teams and Score - Prominent Display */}
                        <div className="grid grid-cols-7 items-center py-3 bg-gray-50 rounded-lg mb-3">
                          <div className="col-span-3 text-right pr-3">
                            <div className="text-lg font-bold">
                              {match.team_name1 || 'Home Team'}
                            </div>
                          </div>
                          
                          <div className="col-span-1 text-center">
                            <span className="font-bold text-xl px-3 py-1 bg-white rounded-lg border">
                              {match.results !== 'N/A' ? match.goal_score : 'vs'}
                            </span>
                          </div>
                          
                          <div className="col-span-3 text-left pl-3">
                            <div className="text-lg font-bold">
                              {match.team_name2 || 'Away Team'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Link to={`/matches/${match.match_no}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                            View match details
                          </Link>
                        </div>
                      </div>
                    )) 
                  : <p className="p-6 text-center text-gray-500">No matches available for this tournament.</p>
                }
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.team_id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{team.team_name}</h4>
                  <div className="flex justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <p><span className="font-medium">Matches:</span> {team.match_played || 0}</p>
                      <p><span className="font-medium">Record:</span> {team.won || 0}W {team.drawn || 0}D {team.lost || 0}L</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p><span className="font-medium">Goals:</span> {team.goals_for || 0} / {team.goals_against || 0}</p>
                      <p><span className="font-medium">Points:</span> {team.points || 0}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Link 
                      to={`/teams/${team.team_id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Team Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'standings' && (
          <LeagueStandings tournamentId={id} />
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;
