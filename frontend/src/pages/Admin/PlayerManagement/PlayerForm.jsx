import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PlayerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    position_to_play: 'MF',
    jersey_no: '',
    team_id: ''
  });

  useEffect(() => {
    // Fetch teams (in a real app, this would be an API call)
    const fetchTeams = async () => {
      // Simulate API call
      setTimeout(() => {
        const teamsData = [
          { team_id: 1214, team_name: 'CCM' },
          { team_id: 1215, team_name: 'KBS' },
          { team_id: 1216, team_name: 'CEP' },
          { team_id: 1217, team_name: 'CPG' },
          { team_id: 1218, team_name: 'CIE' },
          { team_id: 1219, team_name: 'MGE' },
        ];
        
        setTeams(teamsData);
        
        // If no team is selected yet, select the first one
        if (!formData.team_id && teamsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            team_id: teamsData[0].team_id
          }));
        }
      }, 300);
    };

    fetchTeams();
    
    // If editing, fetch player data
    if (isEditMode) {
      // Simulate API call with dummy data
      setTimeout(() => {
        const playerData = {
          player_id: parseInt(id),
          name: id === '1001' ? 'Ahmed' : id === '1003' ? 'Saeed' : 'Majid',
          date_of_birth: '1999-03-10',
          position_to_play: 'GK',
          jersey_no: 1,
          team_id: 1214
        };
        
        setFormData({
          name: playerData.name,
          date_of_birth: playerData.date_of_birth,
          position_to_play: playerData.position_to_play,
          jersey_no: playerData.jersey_no,
          team_id: playerData.team_id
        });
        
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, formData.team_id]);

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
    if (!formData.name.trim()) {
      setError('Player name is required');
      return;
    }
    
    if (!formData.date_of_birth) {
      setError('Date of birth is required');
      return;
    }
    
    if (!formData.jersey_no) {
      setError('Jersey number is required');
      return;
    }
    
    if (isNaN(parseInt(formData.jersey_no)) || parseInt(formData.jersey_no) <= 0) {
      setError('Jersey number must be a positive number');
      return;
    }
    
    if (!formData.team_id) {
      setError('Team selection is required');
      return;
    }
    
    setError(null);
    
    // In a real app, this would call an API to save the data
    console.log('Saving player:', formData);
    
    // Navigate back to player list
    navigate('/admin/players');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Player' : 'Register New Player'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update player information' : 'Add a new player to the system'}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="mr-1">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</Link> /
          </li>
          <li className="mx-1">
            <Link to="/admin/players" className="text-blue-600 hover:text-blue-800">Players</Link> /
          </li>
          <li className="ml-1">{isEditMode ? 'Edit' : 'Register'}</li>
        </ol>
      </nav>

      {/* Player Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Player Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date_of_birth" className="block text-gray-700 font-medium mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="position_to_play" className="block text-gray-700 font-medium mb-2">
                Position *
              </label>
              <select
                id="position_to_play"
                name="position_to_play"
                value={formData.position_to_play}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="GK">Goalkeeper</option>
                <option value="DF">Defender</option>
                <option value="MF">Midfielder</option>
                <option value="FD">Forward</option>
              </select>
            </div>

            <div>
              <label htmlFor="jersey_no" className="block text-gray-700 font-medium mb-2">
                Jersey Number *
              </label>
              <input
                type="number"
                id="jersey_no"
                name="jersey_no"
                value={formData.jersey_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="99"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="team_id" className="block text-gray-700 font-medium mb-2">
              Team *
            </label>
            <select
              id="team_id"
              name="team_id"
              value={formData.team_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          <div className="flex items-center justify-end space-x-3">
            <Link
              to="/admin/players"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isEditMode ? 'Update Player' : 'Register Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;
