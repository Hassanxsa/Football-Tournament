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










// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});