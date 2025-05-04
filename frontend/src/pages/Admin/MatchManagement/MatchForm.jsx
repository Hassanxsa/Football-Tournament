import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MatchForm = () => {
  const { id, action } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const isRecordingResult = action === 'record';
  
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    match_no: '',
    tr_id: '',
    play_stage: 'G',
    play_date: '',
    team1_id: '',
    team2_id: '',
    team1_score: '',
    team2_score: '',
    venue_id: '',
    status: 'scheduled'
  });

  // For validating team selection
  const [disabledTeams, setDisabledTeams] = useState([]);

  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      // Tournaments data
      const tournamentsData = [
        { tr_id: 1, tr_name: 'Faculty Tournament' },
        { tr_id: 2, tr_name: 'Open Tournament' },
        { tr_id: 3, tr_name: 'Student Tournament' }
      ];
      
      // Venues data
      const venuesData = [
        { venue_id: 1, venue_name: 'Stadium 1' },
        { venue_id: 2, venue_name: 'Stadium 2' },
        { venue_id: 3, venue_name: 'Stadium 3' }
      ];
      
      // All teams data
      const teamsData = [
        { team_id: 1214, team_name: 'CCM' },
        { team_id: 1215, team_name: 'KBS' },
        { team_id: 1216, team_name: 'CEP' },
        { team_id: 1217, team_name: 'CPG' },
        { team_id: 1218, team_name: 'CIE' },
        { team_id: 1219, team_name: 'MGE' },
        { team_id: 1220, team_name: 'CHE' },
        { team_id: 1221, team_name: 'ARC' },
        { team_id: 1222, team_name: 'COE' },
        { team_id: 1223, team_name: 'ICS' }
      ];
      
      // Set the data
      setTournaments(tournamentsData);
      setVenues(venuesData);
      setTeams(teamsData);
      
      // If editing, fetch match data
      if (isEditMode) {
        // Dummy match data for editing
        const matchData = {
          match_id: parseInt(id),
          match_no: 5,
          tr_id: 2,
          play_stage: 'G',
          play_date: '2023-03-18',
          team1_id: 1215,
          team2_id: 1219,
          team1_score: isRecordingResult ? null : 3,
          team2_score: isRecordingResult ? null : 1,
          venue_id: 1,
          status: isRecordingResult ? 'scheduled' : 'completed'
        };
        
        // Set form data from match
        setFormData({
          match_no: matchData.match_no,
          tr_id: matchData.tr_id,
          play_stage: matchData.play_stage,
          play_date: matchData.play_date,
          team1_id: matchData.team1_id,
          team2_id: matchData.team2_id,
          team1_score: matchData.team1_score,
          team2_score: matchData.team2_score,
          venue_id: matchData.venue_id,
          status: matchData.status
        });
        
        // Auto-load teams for the selected tournament
        if (matchData.tr_id) {
          // Teams in this tournament
          const tournamentTeamsData = teamsData.filter(team => 
            [1214, 1215, 1216, 1217, 1218, 1219].includes(team.team_id)
          );
          setTournamentTeams(tournamentTeamsData);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [id, isEditMode, isRecordingResult]);

  // Handle tournament change
  const handleTournamentChange = (e) => {
    const tournamentId = parseInt(e.target.value);
    
    // Update form data
    setFormData({
      ...formData,
      tr_id: tournamentId,
      team1_id: '',
      team2_id: ''
    });
    
    // Clear team selections when tournament changes
    setDisabledTeams([]);
    
    // Load teams for this tournament (in a real app, this would be an API call)
    if (tournamentId) {
      // Simulate teams in this tournament
      let tournamentTeamsData = [];
      
      if (tournamentId === 1) { // Faculty Tournament
        tournamentTeamsData = teams.filter(team => 
          [1214, 1215, 1216, 1217, 1218, 1219].includes(team.team_id)
        );
      } else if (tournamentId === 2) { // Open Tournament
        tournamentTeamsData = teams.filter(team => 
          [1214, 1215, 1218, 1219, 1220, 1221, 1222, 1223].includes(team.team_id)
        );
      } else if (tournamentId === 3) { // Student Tournament
        tournamentTeamsData = teams.filter(team => 
          [1214, 1216, 1217, 1218, 1220, 1221, 1222, 1223].includes(team.team_id)
        );
      }
      
      setTournamentTeams(tournamentTeamsData);
    } else {
      setTournamentTeams([]);
    }
  };

  // Handle team selection
  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
    
    // If selecting team1, disable it for team2
    if (name === 'team1_id' && value) {
      setDisabledTeams([parseInt(value)]);
    }
    // If selecting team2, disable it for team1
    else if (name === 'team2_id' && value) {
      setDisabledTeams([parseInt(value)]);
    }
  };

  // Handle general input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.tr_id) {
      setError('Please select a tournament');
      return;
    }
    
    if (!formData.team1_id || !formData.team2_id) {
      setError('Please select both teams');
      return;
    }
    
    if (formData.team1_id === formData.team2_id) {
      setError('Teams must be different');
      return;
    }
    
    if (!formData.play_date) {
      setError('Match date is required');
      return;
    }
    
    if (!formData.venue_id) {
      setError('Please select a venue');
      return;
    }
    
    if (isRecordingResult || formData.status === 'completed') {
      if (formData.team1_score === '' || formData.team2_score === '') {
        setError('Both team scores are required');
        return;
      }
      
      if (isNaN(parseInt(formData.team1_score)) || isNaN(parseInt(formData.team2_score))) {
        setError('Scores must be valid numbers');
        return;
      }
    }
    
    setError(null);
    
    // In a real app, this would call an API to save the data
    console.log('Saving match:', formData);
    
    // Set status to completed if recording result
    if (isRecordingResult) {
      formData.status = 'completed';
    }
    
    // Navigate back to match list
    navigate('/admin/matches');
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
        <h1 className="text-2xl font-bold text-gray-800">
          {isRecordingResult ? 'Record Match Result' : 
           isEditMode ? 'Edit Match' : 'Schedule New Match'}
        </h1>
        <p className="text-gray-600">
          {isRecordingResult ? 'Enter the final score and details for this match' : 
           isEditMode ? 'Update match details' : 'Create a new match in the schedule'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/matches" className="text-blue-600 hover:text-blue-800">Matches</Link> /
          </li>
          <li className="ml-1">
            {isRecordingResult ? 'Record Result' : isEditMode ? 'Edit' : 'Schedule'}
          </li>
        </ol>
      </nav>

      {/* Match Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 max-w-3xl">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="tr_id" className="block text-gray-700 font-medium mb-2">
                Tournament *
              </label>
              <select
                id="tr_id"
                name="tr_id"
                value={formData.tr_id}
                onChange={handleTournamentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isEditMode}
              >
                <option value="">Select Tournament</option>
                {tournaments.map(tournament => (
                  <option key={tournament.tr_id} value={tournament.tr_id}>
                    {tournament.tr_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="match_no" className="block text-gray-700 font-medium mb-2">
                Match Number *
              </label>
              <input
                type="number"
                id="match_no"
                name="match_no"
                value={formData.match_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="play_date" className="block text-gray-700 font-medium mb-2">
              Match Date *
            </label>
            <input
              type="date"
              id="play_date"
              name="play_date"
              value={formData.play_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="play_stage" className="block text-gray-700 font-medium mb-2">
                Stage
              </label>
              <select
                id="play_stage"
                name="play_stage"
                value={formData.play_stage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="G">Group Stage</option>
                <option value="Q">Quarter-Finals</option>
                <option value="S">Semi-Finals</option>
                <option value="F">Final</option>
              </select>
            </div>

            <div>
              <label htmlFor="venue_id" className="block text-gray-700 font-medium mb-2">
                Venue *
              </label>
              <select
                id="venue_id"
                name="venue_id"
                value={formData.venue_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.venue_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Teams *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="team1_id" className="block text-gray-600 text-sm mb-1">
                  Home Team
                </label>
                <select
                  id="team1_id"
                  name="team1_id"
                  value={formData.team1_id}
                  onChange={handleTeamChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.tr_id || isRecordingResult}
                >
                  <option value="">Select Team</option>
                  {tournamentTeams.map(team => (
                    <option 
                      key={team.team_id} 
                      value={team.team_id}
                      disabled={formData.team2_id === team.team_id}
                    >
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="team2_id" className="block text-gray-600 text-sm mb-1">
                  Away Team
                </label>
                <select
                  id="team2_id"
                  name="team2_id"
                  value={formData.team2_id}
                  onChange={handleTeamChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.tr_id || isRecordingResult}
                >
                  <option value="">Select Team</option>
                  {tournamentTeams.map(team => (
                    <option 
                      key={team.team_id} 
                      value={team.team_id}
                      disabled={formData.team1_id === team.team_id}
                    >
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Score section (visible for completed matches or when recording results) */}
          {(isRecordingResult || formData.status === 'completed' || isEditMode) && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Match Result</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="team1_score" className="block text-gray-600 text-sm mb-1">
                    {formData.team1_id && tournamentTeams.find(t => t.team_id === formData.team1_id)?.team_name || 'Home Team'} Score
                  </label>
                  <input
                    type="number"
                    id="team1_score"
                    name="team1_score"
                    value={formData.team1_score}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required={isRecordingResult || formData.status === 'completed'}
                  />
                </div>

                <div>
                  <label htmlFor="team2_score" className="block text-gray-600 text-sm mb-1">
                    {formData.team2_id && tournamentTeams.find(t => t.team_id === formData.team2_id)?.team_name || 'Away Team'} Score
                  </label>
                  <input
                    type="number"
                    id="team2_score"
                    name="team2_score"
                    value={formData.team2_score}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required={isRecordingResult || formData.status === 'completed'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status selection (only for editing, not for recording result) */}
          {isEditMode && !isRecordingResult && (
            <div className="mb-6">
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/matches"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isRecordingResult ? 'Save Result' : isEditMode ? 'Update Match' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchForm;
