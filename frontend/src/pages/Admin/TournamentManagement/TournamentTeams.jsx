import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const TournamentTeams = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  
  // For editing team stats directly
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editForm, setEditForm] = useState({
    match_played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goal_for: 0,
    goal_against: 0,
    goal_diff: 0,
    points: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from API
    // Simulating API call with dummy data
    setTimeout(() => {
      // Tournament data
      const tournamentData = {
        tr_id: parseInt(id),
        tr_name: id === '1' ? 'Faculty Tournament' : id === '2' ? 'Open Tournament' : 'Student Tournament',
        start_date: '2023-03-01',
        end_date: '2023-04-15',
        status: 'active'
      };

      // Teams in this tournament
      const tournamentTeams = [
        { team_id: 1214, tr_id: parseInt(id), team_name: 'CCM', match_played: 7, won: 6, draw: 1, lost: 0, goal_for: 19, goal_against: 6, goal_diff: 13, points: 19 },
        { team_id: 1216, tr_id: parseInt(id), team_name: 'CEP', match_played: 7, won: 5, draw: 1, lost: 1, goal_for: 15, goal_against: 7, goal_diff: 8, points: 16 },
        { team_id: 1215, tr_id: parseInt(id), team_name: 'KBS', match_played: 7, won: 4, draw: 2, lost: 1, goal_for: 11, goal_against: 8, goal_diff: 3, points: 14 },
        { team_id: 1218, tr_id: parseInt(id), team_name: 'CIE', match_played: 7, won: 4, draw: 0, lost: 3, goal_for: 12, goal_against: 10, goal_diff: 2, points: 12 },
      ];

      // Available teams to add
      const allTeams = [
        { team_id: 1214, team_name: 'CCM' },
        { team_id: 1215, team_name: 'KBS' },
        { team_id: 1216, team_name: 'CEP' },
        { team_id: 1217, team_name: 'CPG' },
        { team_id: 1218, team_name: 'CIE' },
        { team_id: 1219, team_name: 'MGE' },
        { team_id: 1220, team_name: 'CHE' },
        { team_id: 1221, team_name: 'ARC' },
        { team_id: 1222, team_name: 'COE' },
        { team_id: 1223, team_name: 'ICS' },
      ];
      
      // Filter out teams already in the tournament
      const teamsToAdd = allTeams.filter(
        team => !tournamentTeams.some(tt => tt.team_id === team.team_id)
      );
      
      setTournament(tournamentData);
      setTeams(tournamentTeams);
      setAvailableTeams(teamsToAdd);
      setSelectedTeam(teamsToAdd.length > 0 ? teamsToAdd[0].team_id : '');
      setLoading(false);
    }, 500);
  }, [id]);

  const addTeamToTournament = () => {
    if (!selectedTeam) return;
    
    // Find the selected team from available teams
    const teamToAdd = availableTeams.find(t => t.team_id === parseInt(selectedTeam));
    if (!teamToAdd) return;
    
    // Create a new tournament team entry
    const newTournamentTeam = {
      team_id: teamToAdd.team_id,
      tr_id: tournament.tr_id,
      team_name: teamToAdd.team_name,
      match_played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goal_for: 0,
      goal_against: 0,
      goal_diff: 0,
      points: 0
    };
    
    // Add to teams and remove from available teams
    setTeams([...teams, newTournamentTeam]);
    setAvailableTeams(availableTeams.filter(t => t.team_id !== teamToAdd.team_id));
    
    // Reset selection
    setSelectedTeam(availableTeams.length > 1 ? 
      availableTeams.find(t => t.team_id !== parseInt(selectedTeam))?.team_id : '');
  };

  const removeTeamFromTournament = (teamId) => {
    // Find the team to remove
    const teamToRemove = teams.find(t => t.team_id === teamId);
    if (!teamToRemove) return;
    
    // Remove from tournament teams and add back to available teams
    setTeams(teams.filter(t => t.team_id !== teamId));
    setAvailableTeams([...availableTeams, { 
      team_id: teamToRemove.team_id, 
      team_name: teamToRemove.team_name 
    }]);
  };

  const startEditingTeam = (teamId) => {
    const teamToEdit = teams.find(t => t.team_id === teamId);
    if (!teamToEdit) return;
    
    setEditingTeamId(teamId);
    setEditForm({
      match_played: teamToEdit.match_played,
      won: teamToEdit.won,
      draw: teamToEdit.draw,
      lost: teamToEdit.lost,
      goal_for: teamToEdit.goal_for,
      goal_against: teamToEdit.goal_against,
      goal_diff: teamToEdit.goal_diff,
      points: teamToEdit.points
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    
    // Convert input to number and update the form
    const numValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
    
    setEditForm(prev => {
      const updated = { ...prev, [name]: numValue };
      
      // Auto-calculate goal difference
      if (name === 'goal_for' || name === 'goal_against') {
        updated.goal_diff = updated.goal_for - updated.goal_against;
      }
      
      // Auto-calculate points (3 for win, 1 for draw)
      if (name === 'won' || name === 'draw') {
        updated.points = (updated.won * 3) + updated.draw;
      }
      
      return updated;
    });
  };

  const saveTeamStats = () => {
    // In a real app, this would call an API to save the data
    
    // Update the teams array with edited values
    setTeams(teams.map(team => 
      team.team_id === editingTeamId ? { ...team, ...editForm } : team
    ));
    
    // Reset editing state
    setEditingTeamId(null);
  };

  const cancelEditing = () => {
    setEditingTeamId(null);
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
          Manage Teams in {tournament.tr_name}
        </h1>
        <p className="text-gray-600">
          Add or remove teams from this tournament and manage team statistics
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/tournaments" className="text-blue-600 hover:text-blue-800">Tournaments</Link> /
          </li>
          <li className="ml-1">Teams</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Team Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Team to Tournament</h2>
            
            {availableTeams.length === 0 ? (
              <p className="text-gray-600">No more teams available to add.</p>
            ) : (
              <div>
                <div className="mb-4">
                  <label htmlFor="team" className="block text-gray-700 font-medium mb-2">
                    Select Team
                  </label>
                  <select
                    id="team"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableTeams.map(team => (
                      <option key={team.team_id} value={team.team_id}>
                        {team.team_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={addTeamToTournament}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Team
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Teams in Tournament List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Teams in Tournament</h2>
              <p className="text-gray-600 text-sm mt-1">
                {teams.length} teams enrolled in this tournament
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MP
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      W
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      D
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      L
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GF
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GA
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GD
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pts
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                        No teams in this tournament yet
                      </td>
                    </tr>
                  ) : (
                    teams.map(team => (
                      <tr key={team.team_id} className={editingTeamId === team.team_id ? "bg-blue-50" : "hover:bg-gray-50"}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{team.team_name}</div>
                              <div className="text-xs text-gray-500">ID: {team.team_id}</div>
                            </div>
                          </div>
                        </td>
                        
                        {editingTeamId === team.team_id ? (
                          // Editing mode - show input fields
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="match_played"
                                value={editForm.match_played}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="won"
                                value={editForm.won}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="draw"
                                value={editForm.draw}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="lost"
                                value={editForm.lost}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="goal_for"
                                value={editForm.goal_for}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <input 
                                type="number" 
                                name="goal_against"
                                value={editForm.goal_against}
                                onChange={handleEditFormChange}
                                className="w-12 px-2 py-1 text-center border border-gray-300 rounded"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                              {editForm.goal_diff}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                              {editForm.points}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={saveTeamStats}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                Save
                              </button>
                              <button 
                                onClick={cancelEditing}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          // View mode - show data
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.match_played}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.won}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.draw}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.lost}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_for}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_against}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_diff}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{team.points}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => startEditingTeam(team.team_id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => removeTeamFromTournament(team.team_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentTeams;
