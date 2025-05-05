const API_URL = 'http://localhost:5000';

// Create a custom API client using fetch instead of axios
const api = {
  async request(method, url, data = null) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
      method,
      headers,
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(`${API_URL}${url}`, options);
      
      // Handle 401 Unauthorized errors
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      // Parse JSON response
      const result = await response.json();
      
      // Return data in a format similar to axios
      return { data: result };
    } catch (error) {
      throw error;
    }
  },
  
  get(url, config = {}) {
    const queryParams = config.params ? new URLSearchParams(config.params).toString() : '';
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
    return this.request('GET', fullUrl);
  },
  
  post(url, data) {
    return this.request('POST', url, data);
  },
  
  put(url, data) {
    return this.request('PUT', url, data);
  },
  
  delete(url) {
    return this.request('DELETE', url);
  }
};

// Authentication Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    // Store the JWT token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store the user role from the server response
      if (response.data.user && response.data.user.role) {
        localStorage.setItem('userRole', response.data.user.role);
        console.log('User role set to:', response.data.user.role);
      } else {
        // Fallback
        localStorage.setItem('userRole', 'user');
      }
      
      // Also store the entire user object for future reference
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await api.post('/api/signup', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  },
  
  isAdmin: () => {
    return localStorage.getItem('userRole') === 'admin';
  }
};

// Home Page Services
export const homeService = {
  getHomeData: async () => {
    const response = await api.get('/api/home');
    return response.data;
  }
};

// Tournament Services
export const tournamentService = {
  getAllTournaments: async () => {
    const response = await api.get('/api/tournaments');
    return response.data;
  },
  
  getTournamentById: async (id) => {
    const response = await api.get(`/api/tournaments/${id}`);
    return response.data;
  },
  
  getTournamentTeams: async (id) => {
    const response = await api.get(`/api/tournaments/${id}/teams`);
    return response.data;
  },
  
  getTournamentMatches: async (id) => {
    const response = await api.get(`/api/tournaments/${id}/matches`);
    return response.data;
  },
  
  // Admin Services
  getAdminTournaments: async () => {
    const response = await api.get('/api/admin/tournaments');
    return response.data;
  },
  
  createTournament: async (tournamentData) => {
    const response = await api.post('/api/tournaments', tournamentData);
    return response.data;
  },
  
  updateTournament: async (id, tournamentData) => {
    const response = await api.put(`/api/admin/tournaments/${id}`, tournamentData);
    return response.data;
  },
  
  deleteTournament: async (id) => {
    const response = await api.delete(`/api/admin/tournaments/${id}`);
    return response.data;
  }
};

// Team Services
export const teamService = {
  getAllTeams: async (searchParams = {}) => {
    const response = await api.get('/api/teams', { params: searchParams });
    return response.data;
  },
  
  getTeamById: async (id) => {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  },
  
  getTeamPlayers: async (id) => {
    const response = await api.get(`/api/teams/${id}/players`);
    return response.data;
  },
  
  getTeamMatches: async (id) => {
    const response = await api.get(`/api/teams/${id}/matches`);
    return response.data;
  },
  
  getTeamTournaments: async (id) => {
    const response = await api.get(`/api/teams/${id}/tournaments`);
    return response.data;
  },
  
  // Admin Services
  getAdminTeams: async () => {
    const response = await api.get('/api/admin/teams');
    // The API returns { teams: [...], tournaments: [...] }
    // Extract just the teams array
    return response.data && response.data.teams ? response.data.teams : [];
  },
  
  createTeam: async (teamData) => {
    const response = await api.post('/api/admin/teams', teamData);
    return response.data;
  },
  
  deleteTeam: async (teamId) => {
    const response = await api.delete(`/api/admin/teams/${teamId}`);
    return response.data;
  },
  
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/api/admin/teams/${id}`, teamData);
    return response.data;
  },
  
  deleteTeam: async (id) => {
    const response = await api.delete(`/api/admin/teams/${id}`);
    return response.data;
  },
  
  addTeamToTournament: async (data) => {
    const response = await api.post('/api/admin/teams/add-to-tournament', data);
    return response.data;
  },
  
  assignCaptain: async (data) => {
    const response = await api.post('/api/admin/teams/assign-captain', data);
    return response.data;
  }
};

// Player Services
export const playerService = {
  getAllPlayers: async (searchParams = {}) => {
    const response = await api.get('/api/players', { params: searchParams });
    return response.data;
  },
  
  getPlayerById: async (id) => {
    const response = await api.get(`/api/players/${id}`);
    return response.data;
  },
  
  getPlayerMatches: async (id) => {
    const response = await api.get(`/api/players/${id}/matches`);
    return response.data;
  },
  
  getPlayerStats: async (id) => {
    const response = await api.get(`/api/players/${id}/stats`);
    return response.data;
  },
  
  // Admin Services
  createPlayer: async (playerData) => {
    const response = await api.post('/api/admin/players', playerData);
    return response.data;
  },
  
  // Player request services
  submitPlayerRequest: async (requestData) => {
    const response = await api.post('/api/player-request', requestData);
    return response.data;
  },
  
  getPlayerRequests: async () => {
    const response = await api.get('/api/admin/players/requests');
    return response.data;
  },
  
  approvePlayerRequest: async (requestId) => {
    const response = await api.post(`/api/admin/players/approve/${requestId}`);
    return response.data;
  },
  
  rejectPlayerRequest: async (requestId) => {
    const response = await api.post(`/api/admin/players/reject/${requestId}`);
    return response.data;
  },
  
  updatePlayer: async (id, playerData) => {
    const response = await api.put(`/admin/players/${id}`, playerData);
    return response.data;
  },
  
  deletePlayer: async (id) => {
    const response = await api.delete(`/admin/players/${id}`);
    return response.data;
  }
};

// Venue Services
export const venueService = {
  getAllVenues: async (searchParams = {}) => {
    const response = await api.get('/api/venues', { params: searchParams });
    return response.data;
  },
  
  getVenueById: async (id) => {
    const response = await api.get(`/api/venues/${id}`);
    return response.data;
  }
};

// Match Services
export const matchService = {
  getMatches: async () => {
    const response = await api.get('/api/matches');
    return response.data;
  },
  
  getMatchById: async (id) => {
    const response = await api.get(`/api/matches/${id}`);
    return response.data;
  },
  
  getMatchDetails: async (id) => {
    const response = await api.get(`/api/matches/${id}/details`);
    return response.data;
  },
  
  getGoalDetails: async (id) => {
    const response = await api.get(`/api/matches/${id}/goals`);
    return response.data;
  },
  
  getPlayerBookings: async (id) => {
    const response = await api.get(`/api/matches/${id}/bookings`);
    return response.data;
  },
  
  getPlayerInOut: async (id) => {
    const response = await api.get(`/api/matches/${id}/substitutions`);
    return response.data;
  },
  
  getMatchCaptains: async (id) => {
    const response = await api.get(`/api/matches/${id}/captains`);
    return response.data;
  }
};

export default api;
