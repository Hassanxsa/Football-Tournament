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
import adminPlayersRoute from './routes/admin/players.js';
import adminMatchesRoute from './routes/admin/matches.js';




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

// admin players management route
app.use('/api/admin/players', adminPlayersRoute)

// admin matches management route
app.use('/api/admin/matches', adminMatchesRoute)



// Approve or reject a join request (admin only)
app.put(
  '/api/admin/join-requests/:requestId',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { requestId } = req.params;
    const { status, tr_id } = req.body; 
    // tr_id is the tournament you want to enroll them in

    // 1) Validate inputs
    if (!['accepted','rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    if (status === 'accepted' && !tr_id) {
      return res.status(400).json({ error: 'tr_id is required when accepting' });
    }

    try {
      // 2) Update the join-request
      const updateSql = `
        UPDATE public.team_join_requests
           SET status = $1
         WHERE request_id = $2
      RETURNING player_id, team_id;
      `;
      const { rows } = await query(updateSql, [status, requestId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Join request not found' });
      }

      // 3) If accepted, add them to the team roster
      if (status === 'accepted') {
        const { player_id, team_id } = rows[0];
        await query(
          `INSERT INTO public.team_player (player_id, team_id, tr_id)
           VALUES ($1, $2, $3)`,
          [player_id, team_id, tr_id]
        );
      }

      return res.json({ message: `Request ${status}` });
    } catch (err) {
      console.error('Error processing join request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


app.post(
  '/api/player-request',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const player_id = req.user.id;
    const { team_id, requested_position, jersey_no } = req.body;

    if (!team_id || !requested_position || !jersey_no) {
      return res
        .status(400)
        .json({ error: 'team_id, requested_position and jersey_no are required' });
    }

    try {
      // 1) ensure they exist in `player` (upsert)
      await query(
        `
        INSERT INTO public.player (player_id, jersey_no, position_to_play)
             VALUES ($1, $2, $3)
        ON CONFLICT (player_id) DO UPDATE
           SET jersey_no        = EXCLUDED.jersey_no,
               position_to_play = EXCLUDED.position_to_play
        `,
        [player_id, jersey_no, requested_position]
      );

      // 2) insert the join request
      const { rows } = await query(
        `
        INSERT INTO public.team_join_requests
          (player_id, team_id, requested_position)
        VALUES ($1, $2, $3)
        RETURNING request_id, status
        `,
        [player_id, team_id, requested_position]
      );

      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating join request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);





// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});