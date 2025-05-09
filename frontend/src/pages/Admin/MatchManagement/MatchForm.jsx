import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tournamentService, matchService, playerService } from '../../../services/api';

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
  
  // For tracking goals and cards
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [goalScorers, setGoalScorers] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  
  // For adding new goals/cards
  const [newGoal, setNewGoal] = useState({ teamId: '', playerId: '', minute: '', type: 'normal' });
  const [newCard, setNewCard] = useState({ teamId: '', playerId: '', cardType: 'yellow', minute: '' });
  
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
    player_of_match: null, // Always null as required
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
          console.log('Loaded match data:', matchData);
          
          // Get tournament ID either from URL or the match data we fetched
          const tournamentId = trId || matchData.tr_id || '';
          console.log('Using tournament ID:', tournamentId);
          
          // If we have a tournament ID but no teams loaded, fetch the teams for this tournament
          if (tournamentId && tournamentTeams.length === 0) {
            try {
              const tournamentTeamsData = await tournamentService.getTournamentTeams(tournamentId);
              setTournamentTeams(tournamentTeamsData);
              console.log('Loaded teams for tournament:', tournamentTeamsData);
            } catch (err) {
              console.error('Error loading teams for tournament:', err);
            }
          }
            
          setFormData({
            ...matchData,
            play_date: matchData.play_date ? matchData.play_date.split('T')[0] : new Date().toISOString().split('T')[0],
            team_id1: matchData.team_id1,
            team_id2: matchData.team_id2,
            tr_id: tournamentId,
            results: matchData.results || 'N/A',
            goal_score: matchData.goal_score || '0-0',
            decided_by: matchData.decided_by || 'N'
          });
          
          // Load players for both teams
          if (matchData.team_id1) {
            fetchTeamPlayers(matchData.team_id1, setTeam1Players);
          }
          
          if (matchData.team_id2) {
            fetchTeamPlayers(matchData.team_id2, setTeam2Players);
          }
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
  
  // Function to fetch players for a team
  const fetchTeamPlayers = async (teamId, setPlayersFn) => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      // In a real app, you would fetch players for this team from the API
      // For now, we'll create mock data
      const players = [
        { player_id: `${teamId}_1`, player_name: `Player 1 (Team ${teamId})` },
        { player_id: `${teamId}_2`, player_name: `Player 2 (Team ${teamId})` },
        { player_id: `${teamId}_3`, player_name: `Player 3 (Team ${teamId})` },
        { player_id: `${teamId}_4`, player_name: `Player 4 (Team ${teamId})` },
        { player_id: `${teamId}_5`, player_name: `Player 5 (Team ${teamId})` },
      ];
      
      setPlayersFn(players);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching team players:', err);
      setError('Failed to load players for this team');
      setLoading(false);
    }
  };
  
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
  
  // Handle team selection changes
  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // When team is selected, fetch its players
    if (name === 'team_id1' && value) {
      fetchTeamPlayers(value, setTeam1Players);
      // Reset new goal/card state
      setNewGoal(prev => ({ ...prev, teamId: value }));
    } else if (name === 'team_id2' && value) {
      fetchTeamPlayers(value, setTeam2Players);
      // Reset new goal/card state
      setNewCard(prev => ({ ...prev, teamId: value }));
    }
  };
  
  // Handle goal form changes
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle card form changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new goal
  const addGoal = () => {
    if (!newGoal.teamId || !newGoal.playerId || !newGoal.minute) {
      setError('Please fill in all goal details');
      return;
    }
    
    setGoalScorers(prev => [...prev, { ...newGoal, id: Date.now() }]);
    setNewGoal({ teamId: '', playerId: '', minute: '', type: 'normal' });
    setError(null);
  };
  
  // Add a new card
  const addCard = () => {
    if (!newCard.teamId || !newCard.playerId || !newCard.minute) {
      setError('Please fill in all card details');
      return;
    }
    
    setPlayerCards(prev => [...prev, { ...newCard, id: Date.now() }]);
    setNewCard({ teamId: '', playerId: '', cardType: 'yellow', minute: '' });
    setError(null);
  };
  
  // Remove a goal
  const removeGoal = (id) => {
    setGoalScorers(prev => prev.filter(goal => goal.id !== id));
  };
  
  // Remove a card
  const removeCard = (id) => {
    setPlayerCards(prev => prev.filter(card => card.id !== id));
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
      
      // SIMPLIFY: Use direct values from goal_score field
      let goal_score1 = null;
      let goal_score2 = null;
      let matchResult = null;
      
      // Use the goal_score field directly from the form
      if (formData.goal_score && formData.goal_score !== '0-0' && formData.goal_score !== 'N/A') {
        const scoreParts = formData.goal_score.split('-');
        if (scoreParts.length === 2) {
          goal_score1 = parseInt(scoreParts[0], 10) || 0;
          goal_score2 = parseInt(scoreParts[1], 10) || 0;
          console.log('DIRECT SCORE:', goal_score1, '-', goal_score2);
          
          // Determine result based on these scores
          if (goal_score1 > goal_score2) {
            matchResult = 'WIN';
          } else if (goal_score1 < goal_score2) {
            matchResult = 'LOSS';
          } else {
            matchResult = 'DRAW';
          }
        }
      } else {
        // If no manual score, calculate from goal scorers
        if (goalScorers.length > 0) {
          goal_score1 = goalScorers.filter(g => g.teamId === formData.team_id1).length;
          goal_score2 = goalScorers.filter(g => g.teamId === formData.team_id2).length;
          console.log('Calculated scores from goal scorers:', goal_score1, goal_score2);
          
          // Determine result based on these scores
          if (goal_score1 > goal_score2) {
            matchResult = 'WIN';
          } else if (goal_score1 < goal_score2) {
            matchResult = 'LOSS';
          } else {
            matchResult = 'DRAW';
          }
        }
      }
      
      // Ensure we have valid score values (use 0 instead of null)
      goal_score1 = goal_score1 !== null ? goal_score1 : 0;
      goal_score2 = goal_score2 !== null ? goal_score2 : 0;
      
      // Force the result to have a value if both scores are set
      if (goal_score1 !== null && goal_score2 !== null) {
        if (matchResult === null) {
          if (goal_score1 > goal_score2) {
            matchResult = 'WIN';
          } else if (goal_score1 < goal_score2) {
            matchResult = 'LOSS';
          } else {
            matchResult = 'DRAW';
          }
        }
      }
      
      // If match is unplayed, result should be null
      if (formData.results === 'N/A') {
        matchResult = null;
      }
      
      if (isEditMode) {
        // IMPORTANT: Match field names exactly as backend expects
        // Extract scores from the goal_score field
        const [gs1, gs2] = formData.goal_score.split('-').map(num => parseInt(num, 10) || 0);
        
        const matchPayload = {
          play_date: formData.play_date,
          team_id1: parseInt(formData.team_id1, 10),
          team_id2: parseInt(formData.team_id2, 10),
          venue_id: parseInt(formData.venue_id, 10),
          audience: formData.audience ? parseInt(formData.audience, 10) : 0,
          player_of_match: null, // ALWAYS NULL to avoid foreign key constraint errors
          stop1_sec: formData.stop1_sec ? parseInt(formData.stop1_sec, 10) : 0,
          stop2_sec: formData.stop2_sec ? parseInt(formData.stop2_sec, 10) : 0,
          decided_by: 'N',
          // These are required by the backend to compute the goal_score
          goal_score1: gs1,
          goal_score2: gs2,
          // Match the field name in the backend code: result not results
          result: formData.results !== 'N/A' ? formData.results : matchResult,
          tr_id: parseInt(formData.tr_id, 10)
        };
        
        console.log('Updating match with payload:', matchPayload);
        await matchService.updateMatch(matchNo, matchPayload);
        setSuccessMessage('Match updated successfully!');
        
        // Record goals and cards if present
        if (goalScorers.length > 0 || playerCards.length > 0) {
          await recordGoalsAndCards(matchNo);
        }
      } else {
        // IMPORTANT: Match field names exactly as the backend expects them
        // Extract scores from the goal_score field
        const [gs1, gs2] = formData.goal_score.split('-').map(num => parseInt(num, 10) || 0);
        
        const matchPayload = {
          play_date: formData.play_date,
          team_id1: parseInt(formData.team_id1, 10),
          team_id2: parseInt(formData.team_id2, 10),
          venue_id: parseInt(formData.venue_id, 10),
          audience: formData.audience ? parseInt(formData.audience, 10) : 0,
          player_of_match: null, // ALWAYS NULL to avoid foreign key constraint errors
          stop1_sec: 0,
          stop2_sec: 0,
          decided_by: 'N',
          // These are required by the backend to compute the goal_score
          goal_score1: gs1, 
          goal_score2: gs2,
          // Match the field name in the backend code: result not results
          result: formData.results !== 'N/A' ? formData.results : matchResult,
          tr_id: parseInt(formData.tr_id, 10)
        };
        
        console.log('Creating match with payload:', matchPayload);
        const response = await matchService.createMatch(formData.tr_id, matchPayload);
        const matchNo = response.match_no;
        
        // If we have goals or cards, record them
        if (goalScorers.length > 0 || playerCards.length > 0) {
          await recordGoalsAndCards(matchNo);
        }
        
        setSuccessMessage(`Match created successfully! Match #${matchNo}`);
      }
      
      // Helper function to record goals and cards
      async function recordGoalsAndCards(matchNo) {
        // Record goals
        const goalPromises = [];
        if (goalScorers.length > 0) {
          for (const goal of goalScorers) {
            const goalPromise = matchService.recordGoal({
              match_no: parseInt(matchNo, 10),
              player_id: parseInt(goal.playerId, 10),
              team_id: parseInt(goal.teamId, 10),
              goal_time: parseInt(goal.minute, 10),
              goal_type: goal.type || 'N', // Default to Normal
              play_stage: 'G', // Default to Group stage
              goal_schedule: 'NT', // Normal time
              goal_half: parseInt(goal.minute, 10) <= 45 ? 1 : 2 // Determine half based on minute
            }).catch(err => {
              console.error('Error recording goal:', err);
              return null; // Continue with other goals even if one fails
            });
            
            goalPromises.push(goalPromise);
          }
        }
        
        // Record cards
        const cardPromises = [];
        if (playerCards.length > 0) {
          for (const card of playerCards) {
            // Card color must be 'y' for yellow or 'r' for red (single lowercase letter)
            let cardColor = 'y'; // Default to yellow
            if (card.cardType === 'red') {
              cardColor = 'r';
            }
            
            const cardPromise = matchService.recordPlayerCard({
              match_no: parseInt(matchNo, 10),
              player_id: parseInt(card.playerId, 10),
              color: cardColor,
              minute: parseInt(card.minute, 10)
            }).catch(err => {
              console.error('Error recording player card:', err);
              return null; // Continue with other cards even if one fails
            });
            
            cardPromises.push(cardPromise);
          }
        }
        
        // Wait for all goals and cards to be recorded
        return Promise.allSettled([...goalPromises, ...cardPromises]);
      }
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate(`/admin/tournaments/${formData.tr_id}/matches`);
      }, 2000);
      
    } catch (err) {
      console.error('Error saving match:', err);
      setError(`Failed to save match: ${err.message || 'Please try again'}`);
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
              onChange={handleTeamChange}
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
              onChange={handleTeamChange}
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
          
          {/* Player of the Match */}
          <div>
            <label htmlFor="player_of_match" className="block text-sm font-medium text-gray-700 mb-2">
              Player of the Match
            </label>
            <select
              id="player_of_match"
              name="player_of_match"
              value={formData.player_of_match}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Player</option>
              {/* Add players from both teams */}
              {team1Players.map(player => (
                <option key={`t1_${player.player_id}`} value={player.player_id}>
                  {player.player_name} (Home)
                </option>
              ))}
              {team2Players.map(player => (
                <option key={`t2_${player.player_id}`} value={player.player_id}>
                  {player.player_name} (Away)
                </option>
              ))}
            </select>
          </div>
          

        </div>
        
        {/* Goal Scorers Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Goal Scorers</h3>
          <p className="text-sm text-gray-500 mb-4">Record who scored goals in this match</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  name="teamId"
                  value={newGoal.teamId}
                  onChange={handleGoalChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Team</option>
                  {formData.team_id1 && (
                    <option value={formData.team_id1}>
                      {tournamentTeams.find(t => t.team_id === formData.team_id1)?.team_name || 'Home Team'}
                    </option>
                  )}
                  {formData.team_id2 && (
                    <option value={formData.team_id2}>
                      {tournamentTeams.find(t => t.team_id === formData.team_id2)?.team_name || 'Away Team'}
                    </option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                <select
                  name="playerId"
                  value={newGoal.playerId}
                  onChange={handleGoalChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!newGoal.teamId}
                >
                  <option value="">Select Player</option>
                  {newGoal.teamId === formData.team_id1 && 
                    team1Players.map(player => (
                      <option key={player.player_id} value={player.player_id}>
                        {player.player_name}
                      </option>
                    ))
                  }
                  {newGoal.teamId === formData.team_id2 && 
                    team2Players.map(player => (
                      <option key={player.player_id} value={player.player_id}>
                        {player.player_name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minute</label>
                <input
                  type="number"
                  name="minute"
                  value={newGoal.minute}
                  onChange={handleGoalChange}
                  placeholder="When scored"
                  min="1"
                  max="120"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addGoal}
                  className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
          
          {/* List of recorded goals */}
          {goalScorers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minute</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goalScorers.map(goal => {
                    const team = tournamentTeams.find(t => t.team_id === goal.teamId);
                    const playerList = goal.teamId === formData.team_id1 ? team1Players : team2Players;
                    const player = playerList.find(p => p.player_id === goal.playerId);
                    
                    return (
                      <tr key={goal.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{team?.team_name || goal.teamId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{player?.player_name || goal.playerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{goal.minute}′</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeGoal(goal.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No goals recorded yet</p>
          )}
        </div>
      
        {/* Player Cards Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Player Cards</h3>
          <p className="text-sm text-gray-500 mb-4">Record yellow and red cards issued during the match</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  name="teamId"
                  value={newCard.teamId}
                  onChange={handleCardChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Team</option>
                  {formData.team_id1 && (
                    <option value={formData.team_id1}>
                      {tournamentTeams.find(t => t.team_id === formData.team_id1)?.team_name || 'Home Team'}
                    </option>
                  )}
                  {formData.team_id2 && (
                    <option value={formData.team_id2}>
                      {tournamentTeams.find(t => t.team_id === formData.team_id2)?.team_name || 'Away Team'}
                    </option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                <select
                  name="playerId"
                  value={newCard.playerId}
                  onChange={handleCardChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!newCard.teamId}
                >
                  <option value="">Select Player</option>
                  {newCard.teamId === formData.team_id1 && 
                    team1Players.map(player => (
                      <option key={player.player_id} value={player.player_id}>
                        {player.player_name}
                      </option>
                    ))
                  }
                  {newCard.teamId === formData.team_id2 && 
                    team2Players.map(player => (
                      <option key={player.player_id} value={player.player_id}>
                        {player.player_name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select
                  name="cardType"
                  value={newCard.cardType}
                  onChange={handleCardChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="yellow">Yellow Card</option>
                  <option value="red">Red Card</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minute</label>
                <input
                  type="number"
                  name="minute"
                  value={newCard.minute}
                  onChange={handleCardChange}
                  placeholder="When issued"
                  min="1"
                  max="120"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addCard}
                  className={`w-full p-2 text-white rounded-md transition-colors ${newCard.cardType === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
          
          {/* List of recorded cards */}
          {playerCards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minute</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {playerCards.map(card => {
                    const team = tournamentTeams.find(t => t.team_id === card.teamId);
                    const playerList = card.teamId === formData.team_id1 ? team1Players : team2Players;
                    const player = playerList.find(p => p.player_id === card.playerId);
                    
                    return (
                      <tr key={card.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{team?.team_name || card.teamId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{player?.player_name || card.playerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.cardType === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {card.cardType === 'yellow' ? 'Yellow' : 'Red'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{card.minute}′</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeCard(card.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No cards issued yet</p>
          )}
        </div>
        
        {/* Venue Selection */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Venue & Attendance</h3>
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
