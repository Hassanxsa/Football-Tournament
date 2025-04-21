import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import TournamentDetails from './pages/TournamentDetails/TournamentDetails';
import Tournaments from './pages/Tournaments/Tournaments';
import TeamDetails from './pages/TeamDetails/TeamDetails';
import Teams from './pages/Teams/Teams';
import MatchDetails from './pages/MatchDetails/MatchDetails';
import Players from './pages/Players/Players';
import PlayerDetails from './pages/PlayerDetails/PlayerDetails';
import Venues from './pages/Venues/Venues';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
    
          {/* Tournament Routes */}
          <Route path="/tournaments" element={
            <PrivateRoute>
              <Tournaments />
            </PrivateRoute>
          } />
          <Route path="/tournaments/:id" element={
            <PrivateRoute>
              <TournamentDetails />
            </PrivateRoute>
          } />
          
          {/* Team Routes */}
          <Route path="/teams" element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          } />
          <Route path="/teams/:id" element={
            <PrivateRoute>
              <TeamDetails />
            </PrivateRoute>
          } />
          
          {/* Match Routes */}
          <Route path="/matches/:id" element={
            <PrivateRoute>
              <MatchDetails />
            </PrivateRoute>
          } />
          
          {/* Players Routes */}
          <Route path="/players" element={
            <PrivateRoute>
              <Players />
            </PrivateRoute>
          } />
          <Route path="/players/:id" element={
            <PrivateRoute>
              <PlayerDetails />
            </PrivateRoute>
          } />
          
          {/* Venues Routes */}
          <Route path="/venues" element={
            <PrivateRoute>
              <Venues />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/tournaments" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/guest/results/:id" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
