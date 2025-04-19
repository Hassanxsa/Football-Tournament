import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
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
