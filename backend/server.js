// server.js
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import passport from './config/passport.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import logger from 'morgan'
import jwt from 'jsonwebtoken';
import cors from 'cors';  // Import cors
import { query } from './routes/middleware/db.js';
import { checkAdmin } from './routes/middleware/checkAdmin.js';
import axios from 'axios';
const PORT = process.env.PORT || 5000;
// Routing modules

import loginRoute from './routes/auth/login.js';
import signupRoute from './routes/auth/signup.js';

import tournamentsRoute from './routes/tournaments/tournaments.js';
import teamsRoute from './routes/teams/teams.js';
import playersRoute from './routes/players/players.js';
import matchesRoute from './routes/matches/matches.js';
import homeRoute from './routes/home/home.js';
import venuesRoute from './routes/venues/venues.js';
import adminUsersRoute from './routes/admin/users.js';
import adminTournamentsRoute from './routes/admin/tournaments.js';
import adminTeamsRoute from './routes/admin/teams.js';




const app = express();
app.use(logger('dev')) // Log requests to the console
app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


//////// Authentication Routes /////////////

// signup route
app.use('/api/signup', signupRoute);
// login route
app.use('/api/login', loginRoute);


// tournaments route
app.use('/api/tournaments', tournamentsRoute)


// teams route
app.use('/api/teams', teamsRoute)



// players route
app.use('/api/players', playersRoute)

// matches route
app.use('/api/matches', matchesRoute)
// home route
app.use('/api/home', homeRoute)




// venues route
app.use('/api/venues', venuesRoute)

// admin users management  route
app.use('/api/admin/users', adminUsersRoute)

// admin tournaments management route
app.use('/api/admin/tournaments', adminTournamentsRoute)

// admin teams management route
app.use('/api/admin/teams', adminTeamsRoute)





//////////// player routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Get player requests  (admin only - pending and accepted)
app.get(
  '/api/admin/players',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    try {
      // 1) All teams for dropdown
      const teamsSql = `
        SELECT team_id, team_name
        FROM public.team
        ORDER BY team_name;
      `;

      // 2) Pending join‐requests
      const pendingSql = `
        SELECT
          jr.request_id,
          u.id    AS player_id,
          u.first_name || ' ' || u.last_name AS player_name,
          u.date_of_birth,
          EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.date_of_birth))::INT AS age,
          t.team_name,
          p.jersey_no,
          pos.position_desc AS position
        FROM public.team_join_requests jr
        JOIN public.users            u   ON jr.player_id = u.id
        JOIN public.player           p   ON p.player_id = u.id
        JOIN public.team             t   ON jr.team_id   = t.team_id
        JOIN public.playing_position pos ON jr.requested_position = pos.position_id
        WHERE jr.status = 'pending'
        ORDER BY jr.created_at DESC;
      `;

      // 3) Approved requests as actual team members
      const approvedSql = `
        SELECT
          jr.request_id,
          u.id    AS player_id,
          u.first_name || ' ' || u.last_name AS player_name,
          u.date_of_birth,
          EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.date_of_birth))::INT AS age,
          t.team_name,
          p.jersey_no,
          pos.position_desc AS position,
          CASE WHEN t.captain = u.id THEN 'captain' ELSE 'player' END AS role
        FROM public.team_join_requests jr
        JOIN public.users            u   ON jr.player_id = u.id
        JOIN public.player           p   ON p.player_id = u.id
        JOIN public.team             t   ON jr.team_id   = t.team_id
        JOIN public.playing_position pos ON jr.requested_position = pos.position_id
        WHERE jr.status = 'accepted'
        ORDER BY jr.updated_at DESC;
      `;

      const [
        { rows: teams },
        { rows: pendingRequests },
        { rows: approvedPlayers }
      ] = await Promise.all([
        query(teamsSql),
        query(pendingSql),
        query(approvedSql)
      ]);

      return res.json({ teams, pendingRequests, approvedPlayers });
    } catch (err) {
      console.error('Error fetching admin players page data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Approve or reject a join request (admin only)
app.put(
  '/api/admin/join-requests/:requestId',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { requestId } = req.params;
    const { status }   = req.body;  // expected 'accepted' or 'rejected'

    if (!['accepted','rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    try {
      // 1) update the request’s status
      const updSql = `
        UPDATE public.team_join_requests
        SET status = $1
        WHERE request_id = $2
        RETURNING player_id, team_id;
      `;
      const { rows } = await query(updSql, [status, requestId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Request not found' });
      }
      const { player_id, team_id } = rows[0];

      // 2) if accepted, add to roster
      if (status === 'accepted') {
        await query(
          `INSERT INTO public.team_player (player_id, team_id, tr_id)
           VALUES ($1, $2, /* provide a valid tr_id here */)`,
          [player_id, team_id]
        );
      }

      return res.json({ message: `Request ${status}` });
    } catch (err) {
      console.error('Error processing join request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);




// Create a new player
app.post(
  '/api/admin/players',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { first_name, last_name, date_of_birth, position_to_play } = req.body;
    const sql = `
      INSERT INTO public.player (first_name, last_name, date_of_birth, position_to_play)
      VALUES ($1, $2, $3, $4)
      RETURNING player_id;
    `;

    try {
      const { rows } = await query(sql, [first_name, last_name, date_of_birth, position_to_play]);
      return res.json({ id: rows[0].player_id });
    } catch (err) {
      console.error('Error creating player:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// update a player
app.put(
  '/admin/players/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, position_to_play } = req.body;
    const sql = `
      UPDATE public.player
      SET first_name = $1, last_name = $2, date_of_birth = $3, position_to_play = $4
      WHERE player_id = $5;
    `;

    try {
      await query(sql, [first_name, last_name, date_of_birth, position_to_play, id]);
      return res.json({ message: 'Player updated successfully' });
    } catch (err) {
      console.error('Error updating player:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// delete a player
app.delete(
  '/admin/players/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const sql = `
      DELETE FROM public.player
      WHERE player_id = $1;
    `;

    try {
      await query(sql, [id]);
      return res.json({ message: 'Player deleted successfully' });
    } catch (err) {
      console.error('Error deleting player:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Endpoint to get league standings for a tournament
app.get('/api/tournaments/:trId/standings', async (req, res) => {
  const { trId } = req.params;
  
  try {
    // Get standings with team names
    const standingsResult = await query(
      `SELECT ls.*, t.team_name 
       FROM league_standings ls 
       JOIN team t ON ls.team_id = t.team_id 
       WHERE ls.tr_id = $1 
       ORDER BY ls.position`,
      [trId]
    );
    
    // If no standings found, try to calculate them first
    if (standingsResult.rows.length === 0) {
      await updateLeagueStandings(trId);
      
      // Try to get standings again
      const updatedStandingsResult = await query(
        `SELECT ls.*, t.team_name 
         FROM league_standings ls 
         JOIN team t ON ls.team_id = t.team_id 
         WHERE ls.tr_id = $1 
         ORDER BY ls.position`,
        [trId]
      );
      
      res.json(updatedStandingsResult.rows);
    } else {
      res.json(standingsResult.rows);
    }
  } catch (err) {
    console.error('Error fetching standings:', err);
    res.status(500).json({ message: 'Failed to fetch standings', error: err.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});