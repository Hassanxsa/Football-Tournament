import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tournamentService, matchService } from '../../../services/api';

const MatchForm = () => {
  const { trId, matchNo } = useParams(); // trId for tournament ID, matchNo for match ID when editing
  const navigate = useNavigate();
  const isEditMode = !!matchNo;
  
  const [tournaments, setTournaments] = useState([]);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Initialize with default values
  const [formData, setFormData] = useState({
    play_date: new Date().toISOString().split('T')[0], // Today's date
    team_id1: '',
    team_id2: '',
    venue_id: '',
    results: 'N/A', // Not available initially
    decided_by: 'N', // Normal play
    goal_score: '0-0', // Default score
    audience: 0,
    player_of_match: 123456789, // Default to system user ID
    stop1_sec: 0,
    stop2_sec: 0,
    tr_id: trId || ''
  });

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch tournaments list
        const tournamentsData = await tournamentService.getAllTournaments();
        setTournaments(tournamentsData);
        
        // Fetch venues list
        const venuesData = await matchService.getVenues();
        setVenues(venuesData);
        
        // If tournament ID is provided, fetch teams for that tournament
        if (trId) {
          const tournamentTeamsData = await tournamentService.getTournamentTeams(trId);
          setTournamentTeams(tournamentTeamsData);
          setFormData(prev => ({ ...prev, tr_id: trId }));
        }
        
        // If editing an existing match, fetch its details
        if (isEditMode && matchNo) {
          const matchData = await matchService.getMatchById(matchNo);
          // Use the tournament ID from the URL or try to get it from other match data
          let tournamentId = trId || '';
            
          setFormData({
            ...matchData,
            play_date: matchData.play_date ? matchData.play_date.split('T')[0] : new Date().toISOString().split('T')[0],
            team_id1: matchData.team_id1,
            team_id2: matchData.team_id2,
            tr_id: tournamentId || '',
            results: matchData.results || 'N/A',
            goal_score: matchData.goal_score || '0-0',
            decided_by: matchData.decided_by || 'N'
          })
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load necessary data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trId, matchNo, isEditMode]);
  
  // When tournament changes, fetch its teams
  const handleTournamentChange = async (e) => {
    const selectedTournamentId = e.target.value;
    setFormData(prev => ({ ...prev, tr_id: selectedTournamentId, team_id1: '', team_id2: '' }));
    
    if (selectedTournamentId) {
      try {
        setLoading(true);
        const teamsData = await tournamentService.getTournamentTeams(selectedTournamentId);
        setTournamentTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournament teams:', err);
        setError('Failed to load teams for this tournament');
        setLoading(false);
      }
    } else {
      setTournamentTeams([]);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.play_date || !formData.team_id1 || !formData.team_id2 || !formData.venue_id || !formData.tr_id) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate that two different teams are selected
    if (formData.team_id1 === formData.team_id2) {
      setError('Please select two different teams');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditMode) {
        // Update existing match
        await matchService.updateMatch(matchNo, formData);
        setSuccessMessage('Match updated successfully!');
      } else {
        // Create new match
        const result = await matchService.createMatch(formData.tr_id, formData);
        setSuccessMessage(`Match created successfully! Match #${result.match_no}`);
      }
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate(`/admin/tournaments/${formData.tr_id}/matches`);
      }, 2000);
      
    } catch (err) {
      console.error('Error saving match:', err);
      setError('Failed to save match. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          {isEditMode ? 'Edit Match' : 'Create New Match'}
        </h1>
        <Link
          to="/admin/tournaments"
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
        >
          Back to Tournaments
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tournament Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tr_id" className="block text-sm font-medium text-gray-700 mb-2">
              Tournament <span className="text-red-500">*</span>
            </label>
            <select
              id="tr_id"
              name="tr_id"
              value={formData.tr_id}
              onChange={handleTournamentChange}
              disabled={isEditMode}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Tournament</option>
              {tournaments.map(tournament => (
                <option key={tournament.tr_id} value={tournament.tr_id}>
                  {tournament.tr_name}
                </option>
              ))}
            </select>
            {isEditMode && <p className="text-xs text-gray-500 mt-1">Tournament cannot be changed for existing matches</p>}
          </div>
          

        </div>
        
        {/* Match Date */}
        <div>
          <label htmlFor="play_date" className="block text-sm font-medium text-gray-700 mb-2">
            Match Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="play_date"
            name="play_date"
            value={formData.play_date}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Teams Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="team_id1" className="block text-sm font-medium text-gray-700 mb-2">
              Home Team <span className="text-red-500">*</span>
            </label>
            <select
              id="team_id1"
              name="team_id1"
              value={formData.team_id1}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!formData.tr_id || tournamentTeams.length === 0}
            >
              <option value="">Select Home Team</option>
              {tournamentTeams.map(team => (
                <option 
                  key={team.team_id} 
                  value={team.team_id}
                  disabled={team.team_id === formData.team_id2} // Disable if already selected as away team
                >
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="team_id2" className="block text-sm font-medium text-gray-700 mb-2">
              Away Team <span className="text-red-500">*</span>
            </label>
            <select
              id="team_id2"
              name="team_id2"
              value={formData.team_id2}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!formData.tr_id || tournamentTeams.length === 0}
            >
              <option value="">Select Away Team</option>
              {tournamentTeams.map(team => (
                <option 
                  key={team.team_id} 
                  value={team.team_id}
                  disabled={team.team_id === formData.team_id1} // Disable if already selected as home team
                >
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Match Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-4 mt-4">
          <div className="md:col-span-3">
            <h3 className="text-lg font-medium text-gray-700">Match Results</h3>
            <p className="text-sm text-gray-500">Fill these in after the match has been played</p>
          </div>
          
          <div>
            <label htmlFor="goal_score" className="block text-sm font-medium text-gray-700 mb-2">
              Score (Home-Away)
            </label>
            <input
              type="text"
              id="goal_score"
              name="goal_score"
              value={formData.goal_score}
              onChange={handleChange}
              placeholder="e.g. 2-1"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Format as "HomeGoals-AwayGoals" (e.g., 2-1)</p>
          </div>
          
          <div>
            <label htmlFor="results" className="block text-sm font-medium text-gray-700 mb-2">
              Match Result
            </label>
            <select
              id="results"
              name="results"
              value={formData.results}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="N/A">Not Played Yet</option>
              <option value="WIN">Home Team Won</option>
              <option value="LOSS">Away Team Won</option>
              <option value="DRAW">Draw</option>
            </select>
          </div>
          

        </div>
        
        {/* Venue Selection */}
        <div>
          <label htmlFor="venue_id" className="block text-sm font-medium text-gray-700 mb-2">
            Venue <span className="text-red-500">*</span>
          </label>
          <select
            id="venue_id"
            name="venue_id"
            value={formData.venue_id}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Venue</option>
            {venues.map(venue => (
              <option key={venue.venue_id} value={venue.venue_id}>
                {venue.venue_name} ({venue.venue_capacity} capacity)
              </option>
            ))}
          </select>
        </div>
        
        {/* Audience */}
        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
            Audience Size
          </label>
          <input
            type="number"
            id="audience"
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {submitting ? 'Saving...' : (isEditMode ? 'Update Match' : 'Create Match')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchForm;
