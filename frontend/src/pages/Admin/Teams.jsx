import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminTeams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tournamentIdFromParam = searchParams.get('tournament');
  
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [newTeam, setNewTeam] = useState({ team_name: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  
  // For adding team to tournament
  const [teamToAdd, setTeamToAdd] = useState('');
  
  // For setting captain
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    // In a real app, these would be API calls
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Tournament data
        const tournamentsData = [
          { tr_id: 1, tr_name: 'Faculty Tournament' },
          { tr_id: 2, tr_name: 'Open Tournament' },
          { tr_id: 3, tr_name: 'Student Tournament' }
        ];
        
        // Teams data
        const teamsData = [
          { team_id: 1214, team_name: 'CCM' },
          { team_id: 1215, team_name: 'KBS' },
          { team_id: 1216, team_name: 'CEP' },
          { team_id: 1217, team_name: 'CPG' },
          { team_id: 1218, team_name: 'CIE' },
          { team_id: 1219, team_name: 'MGE' },
          { team_id: 1220, team_name: 'CHE' },
          { team_id: 1221, team_name: 'ARC' }
        ];
        
        // Tournament teams data (for checking which teams are already in tournaments)
        const tournamentTeams = [
          { tr_id: 1, team_id: 1214 },
          { tr_id: 1, team_id: 1215 },
          { tr_id: 1, team_id: 1216 },
          { tr_id: 1, team_id: 1217 },
          { tr_id: 2, team_id: 1218 },
          { tr_id: 2, team_id: 1219 },
          { tr_id: 3, team_id: 1220 },
          { tr_id: 3, team_id: 1221 }
        ];
        
        // Players data with captain info
        const playersData = [
          { player_id: 1001, name: 'Ahmed', team_id: 1214, is_captain: true },
          { player_id: 1002, name: 'Mohammad', team_id: 1214, is_captain: false },
          { player_id: 1003, name: 'Ali', team_id: 1214, is_captain: false },
          { player_id: 1004, name: 'Saeed', team_id: 1215, is_captain: true },
          { player_id: 1005, name: 'Khalid', team_id: 1215, is_captain: false },
          { player_id: 1006, name: 'Omar', team_id: 1216, is_captain: true },
          { player_id: 1007, name: 'Fahad', team_id: 1216, is_captain: false },
          { player_id: 1008, name: 'Abdullah', team_id: 1217, is_captain: false },
          { player_id: 1009, name: 'Nasser', team_id: 1218, is_captain: true },
          { player_id: 1010, name: 'Ibrahim', team_id: 1219, is_captain: false },
          { player_id: 1011, name: 'Majid', team_id: 1220, is_captain: true },
          { player_id: 1012, name: 'Talal', team_id: 1221, is_captain: false }
        ];
        
        // Set all the data
        setTournaments(tournamentsData);
        setTeams(teamsData);
        setPlayers(playersData);
        
        // If tournament is specified in URL param, select it
        if (tournamentIdFromParam) {
          setSelectedTournament(tournamentIdFromParam);
          
          // Get teams not in this tournament yet
          const teamsInTournament = tournamentTeams
            .filter(tt => tt.tr_id === parseInt(tournamentIdFromParam))
            .map(tt => tt.team_id);
          
          const availableTeams = teamsData.filter(team => 
            !teamsInTournament.includes(team.team_id)
          );
          
          if (availableTeams.length > 0) {
            setTeamToAdd(availableTeams[0].team_id.toString());
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tournamentIdFromParam]);

  // Handle team selection for captain assignment
  useEffect(() => {
    if (selectedTeam) {
      const teamPlayersData = players.filter(player => player.team_id === parseInt(selectedTeam));
      setTeamPlayers(teamPlayersData);
      
      // Pre-select the first player if none selected
      if (teamPlayersData.length > 0 && !selectedCaptain) {
        setSelectedCaptain(teamPlayersData[0].player_id.toString());
      }
    } else {
      setTeamPlayers([]);
      setSelectedCaptain('');
    }
  }, [selectedTeam, players]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTeam = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newTeam.team_name.trim()) {
      setError('Team name is required');
      return;
    }
    
    // In a real app, this would be an API call
    // Add team with new ID
    const newId = Math.max(...teams.map(t => t.team_id), 0) + 1;
    const teamToAdd = {
      team_id: newId,
      team_name: newTeam.team_name
    };
    
    setTeams(prev => [...prev, teamToAdd]);
    
    // Reset form and show success message
    setNewTeam({ team_name: '' });
    setError(null);
    setSuccessMessage('Team added successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const addTeamToTournament = () => {
    if (!selectedTournament || !teamToAdd) {
      setError('Please select both a tournament and a team');
      return;
    }
    
    // In a real app, this would be an API call
    // Here we just show a success message
    const tournamentName = tournaments.find(t => t.tr_id === parseInt(selectedTournament))?.tr_name;
    const teamName = teams.find(t => t.team_id === parseInt(teamToAdd))?.team_name;
    
    setSuccessMessage(`Team ${teamName} added to ${tournamentName} successfully!`);
    
    // Reset selection and clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    // Update UI - in a real app you would refresh data from API
    // Here we simulate by removing the team from the dropdown
    setTeamToAdd('');
  };

  const assignCaptain = () => {
    if (!selectedTeam || !selectedCaptain) {
      setError('Please select both a team and a player');
      return;
    }
    
    // In a real app, this would be an API call
    // Update players data with new captain
    const updatedPlayers = players.map(player => {
      if (player.team_id === parseInt(selectedTeam)) {
        // Set is_captain=true for selected player, false for all others in team
        return {
          ...player,
          is_captain: player.player_id === parseInt(selectedCaptain)
        };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    // Update teamPlayers list
    const updatedTeamPlayers = updatedPlayers.filter(player => 
      player.team_id === parseInt(selectedTeam)
    );
    setTeamPlayers(updatedTeamPlayers);
    
    // Show success message
    const teamName = teams.find(t => t.team_id === parseInt(selectedTeam))?.team_name;
    const playerName = players.find(p => p.player_id === parseInt(selectedCaptain))?.name;
    
    setSuccessMessage(`${playerName} assigned as captain of ${teamName} successfully!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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

  // Get teams that are not in the selected tournament
  const getAvailableTeams = () => {
    if (!selectedTournament) return [];
    
    // In a real app, this data would come from the API
    // Here we're using a simplified approach for demo
    const teamsInTournament = [
      { tr_id: 1, team_id: 1214 },
      { tr_id: 1, team_id: 1215 },
      { tr_id: 1, team_id: 1216 },
      { tr_id: 1, team_id: 1217 },
      { tr_id: 2, team_id: 1218 },
      { tr_id: 2, team_id: 1219 },
      { tr_id: 3, team_id: 1220 },
      { tr_id: 3, team_id: 1221 }
    ];
    
    const teamIdsInTournament = teamsInTournament
      .filter(tt => tt.tr_id === parseInt(selectedTournament))
      .map(tt => tt.team_id);
    
    return teams.filter(team => !teamIdsInTournament.includes(team.team_id));
  };

  const availableTeams = getAvailableTeams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
        <p className="text-gray-600">Add teams, assign teams to tournaments, and set team captains</p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Admin Dashboard</Link> /
          </li>
          <li className="ml-1">Teams</li>
        </ol>
      </nav>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Team Form */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Team</h2>
          
          <form onSubmit={addTeam}>
            <div className="mb-4">
              <label htmlFor="team_name" className="block text-gray-700 font-medium mb-2">
                Team Name *
              </label>
              <input
                type="text"
                id="team_name"
                name="team_name"
                value={newTeam.team_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter team name (e.g. CCM, KBS)"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Team
              </button>
            </div>
          </form>
        </div>

        {/* Add Team to Tournament */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Team to Tournament</h2>
          
          <div className="mb-4">
            <label htmlFor="tournament" className="block text-gray-700 font-medium mb-2">
              Select Tournament *
            </label>
            <select
              id="tournament"
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a tournament</option>
              {tournaments.map(tournament => (
                <option key={tournament.tr_id} value={tournament.tr_id}>
                  {tournament.tr_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="team" className="block text-gray-700 font-medium mb-2">
              Select Team *
            </label>
            <select
              id="team"
              value={teamToAdd}
              onChange={(e) => setTeamToAdd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedTournament || availableTeams.length === 0}
              required
            >
              <option value="">Select a team</option>
              {availableTeams.map(team => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
            {selectedTournament && availableTeams.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                No available teams to add to this tournament.
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={addTeamToTournament}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedTournament || !teamToAdd || availableTeams.length === 0}
            >
              Add to Tournament
            </button>
          </div>
        </div>
      </div>

      {/* Assign Team Captain */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Assign Team Captain</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="captainTeam" className="block text-gray-700 font-medium mb-2">
              Select Team *
            </label>
            <select
              id="captainTeam"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a team</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="captain" className="block text-gray-700 font-medium mb-2">
              Select Captain *
            </label>
            <select
              id="captain"
              value={selectedCaptain}
              onChange={(e) => setSelectedCaptain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedTeam || teamPlayers.length === 0}
              required
            >
              <option value="">Select a player</option>
              {teamPlayers.map(player => (
                <option key={player.player_id} value={player.player_id}>
                  {player.name} {player.is_captain ? "(Current Captain)" : ""}
                </option>
              ))}
            </select>
            {selectedTeam && teamPlayers.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                No players available in this team.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={assignCaptain}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedTeam || !selectedCaptain || teamPlayers.length === 0}
          >
            Assign as Captain
          </button>
        </div>
      </div>

      {/* Team List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">All Teams</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Captain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Players
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournaments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No teams found
                  </td>
                </tr>
              ) : (
                teams.map((team) => {
                  // Get captain
                  const captain = players.find(p => p.team_id === team.team_id && p.is_captain);
                  
                  // Get team players count
                  const teamPlayersCount = players.filter(p => p.team_id === team.team_id).length;
                  
                  // Get tournaments this team is in (simplified for demo)
                  const teamTournaments = [
                    { tr_id: 1, team_id: 1214 },
                    { tr_id: 1, team_id: 1215 },
                    { tr_id: 1, team_id: 1216 },
                    { tr_id: 1, team_id: 1217 },
                    { tr_id: 2, team_id: 1218 },
                    { tr_id: 2, team_id: 1219 },
                    { tr_id: 3, team_id: 1220 },
                    { tr_id: 3, team_id: 1221 }
                  ].filter(tt => tt.team_id === team.team_id);
                  
                  const teamTournamentNames = teamTournaments.map(tt => {
                    const tournament = tournaments.find(t => t.tr_id === tt.tr_id);
                    return tournament ? tournament.tr_name : 'Unknown';
                  });
                  
                  return (
                    <tr key={team.team_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{team.team_name}</div>
                        <div className="text-xs text-gray-500">ID: {team.team_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {captain ? (
                          <div className="text-sm text-gray-900">{captain.name}</div>
                        ) : (
                          <div className="text-sm text-red-500">No captain assigned</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teamPlayersCount} player{teamPlayersCount !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teamTournamentNames.length > 0 ? (
                          teamTournamentNames.join(', ')
                        ) : (
                          <span className="text-yellow-500">Not in any tournament</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTeams;
