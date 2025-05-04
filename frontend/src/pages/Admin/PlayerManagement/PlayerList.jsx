import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayerList = () => {
  // In a real app, this would come from an API
  const [players, setPlayers] = useState([
    { player_id: 1001, name: 'Ahmed', jersey_no: 1, position_to_play: 'GK', position_desc: 'Goalkeeper', date_of_birth: '1999-03-10', team_name: 'CCM' },
    { player_id: 1003, name: 'Saeed', jersey_no: 2, position_to_play: 'DF', position_desc: 'Defender', date_of_birth: '2005-03-10', team_name: 'CCM' },
    { player_id: 1005, name: 'Majid', jersey_no: 3, position_to_play: 'DF', position_desc: 'Defender', date_of_birth: '1996-03-10', team_name: 'CCM' },
    { player_id: 1007, name: 'Ahmed', jersey_no: 4, position_to_play: 'MF', position_desc: 'Midfielder', date_of_birth: '2001-03-10', team_name: 'KBS' },
    { player_id: 1009, name: 'Fahd', jersey_no: 5, position_to_play: 'FD', position_desc: 'Forward', date_of_birth: '2008-03-10', team_name: 'CEP' },
    { player_id: 1011, name: 'Ali', jersey_no: 1, position_to_play: 'GK', position_desc: 'Goalkeeper', date_of_birth: '2000-05-15', team_name: 'KBS' },
    { player_id: 1013, name: 'Mohammed', jersey_no: 10, position_to_play: 'MF', position_desc: 'Midfielder', date_of_birth: '1997-11-22', team_name: 'CEP' },
    { player_id: 1015, name: 'Khalid', jersey_no: 9, position_to_play: 'FD', position_desc: 'Forward', date_of_birth: '2002-08-07', team_name: 'CPG' },
    { player_id: 1017, name: 'Ibrahim', jersey_no: 5, position_to_play: 'DF', position_desc: 'Defender', date_of_birth: '1998-04-18', team_name: 'CPG' },
    { player_id: 1019, name: 'Omar', jersey_no: 8, position_to_play: 'MF', position_desc: 'Midfielder', date_of_birth: '2003-12-30', team_name: 'MGE' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const deletePlayer = (id) => {
    // In a real app, this would call an API
    setPlayers(players.filter(player => player.player_id !== id));
  };

  // Filter players based on search term and filters
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.team_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === '' || player.position_to_play === positionFilter;
    const matchesTeam = teamFilter === '' || player.team_name === teamFilter;
    
    return matchesSearch && matchesPosition && matchesTeam;
  });

  // Get unique teams for filter
  const teams = [...new Set(players.map(player => player.team_name))];
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Player Management</h1>
          <p className="text-gray-600">Manage all players in the system</p>
        </div>
        <Link 
          to="/admin/players/create" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
        >
          Register New Player
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="ml-1">Players</li>
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
              placeholder="Search by name or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              id="position"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Positions</option>
              <option value="GK">Goalkeeper</option>
              <option value="DF">Defender</option>
              <option value="MF">Midfielder</option>
              <option value="FD">Forward</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              id="team"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Player List Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jersey #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No players found matching your criteria
                </td>
              </tr>
            ) : (
              filteredPlayers.map(player => (
                <tr key={player.player_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        <div className="text-xs text-gray-500">ID: {player.player_id}</div>
                        <div className="text-xs text-gray-500">DOB: {formatDate(player.date_of_birth)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/teams/${player.team_name}`} className="text-sm text-green-600 hover:text-green-900">
                      {player.team_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${player.position_to_play === 'GK' ? 'bg-yellow-100 text-yellow-800' : 
                        player.position_to_play === 'DF' ? 'bg-blue-100 text-blue-800' :
                        player.position_to_play === 'MF' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {player.position_desc}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.jersey_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateAge(player.date_of_birth)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link 
                        to={`/admin/players/${player.player_id}`} 
                        className="text-purple-600 hover:text-purple-900"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/players/${player.player_id}/edit`} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deletePlayer(player.player_id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerList;
