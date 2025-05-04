import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Main Pages
import Home from './pages/Home/Home';
import Tournaments from './pages/Tournaments/Tournaments';
import TournamentDetails from './pages/TournamentDetails/TournamentDetails';
import Teams from './pages/Teams/Teams';
import TeamDetails from './pages/TeamDetails/TeamDetails';
import MatchDetails from './pages/MatchDetails/MatchDetails';
import Players from './pages/Players/Players';
import PlayerDetails from './pages/PlayerDetails/PlayerDetails';
import Venues from './pages/Venues/Venues';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminTournaments from './pages/Admin/Tournaments';
import AdminTeams from './pages/Admin/Teams';
import AdminPlayers from './pages/Admin/Players';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* All Protected Routes - Within Layout */}
        <Route path="/*" element={
          <PrivateRoute>
            <Layout>
              <Routes>
                {/* Protected Routes */}
                <Route path="home" element={<Home />} />
          
                {/* Tournament Routes */}
                <Route path="tournaments" element={<Tournaments />} />
                <Route path="tournaments/:id" element={<TournamentDetails />} />
                
                {/* Team Routes */}
                <Route path="teams" element={<Teams />} />
                <Route path="teams/:id" element={<TeamDetails />} />
                
                {/* Match Routes */}
                <Route path="matches/:id" element={<MatchDetails />} />
                
                {/* Players Routes */}
                <Route path="players" element={<Players />} />
                <Route path="players/:id" element={<PlayerDetails />} />
                
                {/* Venues Routes */}
                <Route path="venues" element={<Venues />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/tournaments" element={<AdminTournaments />} />
                <Route path="admin/teams" element={<AdminTeams />} />
                <Route path="admin/players" element={<AdminPlayers />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
