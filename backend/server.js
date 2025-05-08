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

app.get(
  '/api/venues',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { search, status } = req.query;
    const conditions = [];
    const values     = [];

    // Filter by name substring
    if (search) {
      conditions.push(`v.venue_name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }
    // Filter by status code
    if (status) {
      conditions.push(`v.venue_status = $${values.length + 1}`);
      values.push(status);
    }

    const sql = `
      SELECT
        v.venue_id,
        v.venue_name,
        v.venue_status,
        v.venue_capacity,
        COALESCE(mp.num_matches, 0) AS num_matches
      FROM public.venue AS v

      /* Count how many matches each venue has hosted */
      LEFT JOIN (
        SELECT
          venue_id,
          COUNT(*) AS num_matches
        FROM public.match_played
        GROUP BY venue_id
      ) AS mp
        ON mp.venue_id = v.venue_id

      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}

      ORDER BY v.venue_name;
    `;

    try {
      const { rows } = await query(sql, values);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching venues:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);




// admin tournament route

/////////////////////// tournament routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.get(
  '/api/admin/tournaments',
  passport.authenticate('jwt', { session: false }),  // ensure user is logged in
  checkAdmin,                                        // ensure user is an admin
  async (req, res) => {
    try {
      // Fetch all tournaments (or filter to “current” as needed)
      const sql = `
        SELECT
          tr_id,
          tr_name,
          start_date,
          end_date
        FROM public.tournament
        ORDER BY tr_id;
      `;
      const { rows } = await query(sql);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching admin tournaments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Create a new tournament
app.post(
  '/api/tournaments',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { tr_name, start_date, end_date } = req.body;

    if (!tr_name || !start_date || !end_date) {
      return res
        .status(400)
        .json({ error: 'tr_name, start_date and end_date are required' });
    }

    try {
      // 1) Get the current max tr_id
      const maxResult = await query(
        'SELECT COALESCE(MAX(tr_id), 0) AS max_id FROM public.tournament'
      );
      const maxId = parseInt(maxResult.rows[0].max_id, 10);
      const nextId = maxId + 1;

      // 2) Insert the new tournament with that tr_id
      const insertSql = `
        INSERT INTO public.tournament (tr_id, tr_name, start_date, end_date)
        VALUES ($1, $2, $3, $4)
        RETURNING tr_id, tr_name, start_date, end_date;
      `;
      const { rows } = await query(insertSql, [
        nextId,
        tr_name,
        start_date,
        end_date,
      ]);

      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating tournament:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);




// update a tournament
app.put(
  '/api/admin/tournaments/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { name, start_date, end_date, status } = req.body;

    // basic validation
    if (!name || !start_date || !end_date || !status) {
      return res
        .status(400)
        .json({ error: 'name, start_date, end_date and status are required' });
    }

    const sql = `
      UPDATE public.tournament
      SET
        tr_name    = $1,
        start_date = $2,
        end_date   = $3,
        status     = $4
      WHERE tr_id = $5;
    `;

    try {
      const result = await query(sql, [name, start_date, end_date, status, id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
      return res.json({ message: 'Tournament updated successfully' });
    } catch (err) {
      console.error('Error updating tournament:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// delete a tournament
app.delete(
  '/api/admin/tournaments/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const sql = `
      DELETE FROM public.tournament
      WHERE tr_id = $1;
    `;

    try {
      await query(sql, [id]);
      return res.json({ message: 'Tournament deleted successfully' });
    } catch (err) {
      console.error('Error deleting tournament:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
/////////////////////////  team routes \\\\\\\\\\\\\\\\\\\\\\\\\\
app.get(
  '/api/admin/teams',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    try {
      // 1) Teams with captain, player count, and tournaments
      const teamsSql = `
        SELECT
          t.team_id,
          t.team_name,

          -- most recent match captain for this team
          cap.player_captain AS captain_id,
          (u.first_name || ' ' || u.last_name) AS captain_name,

          -- how many players this team has
          COALESCE(tp_counts.num_players, 0) AS num_players,

          -- array of tournament names this team participates in
          COALESCE(tr.tournaments, '{}') AS tournaments
        FROM public.team AS t

        /* captain: pick the player_captain from the latest match_captain row */
        LEFT JOIN LATERAL (
          SELECT player_captain
          FROM public.match_captain mc
          WHERE mc.team_id = t.team_id
          ORDER BY mc.match_no DESC
          LIMIT 1
        ) AS cap ON true

        /* join to users for captain’s name */
        LEFT JOIN public.player     AS cap_p ON cap.player_captain = cap_p.player_id
        LEFT JOIN public.users      AS u     ON cap_p.player_id   = u.id

        /* count distinct players on each team */
        LEFT JOIN (
          SELECT team_id, COUNT(DISTINCT player_id) AS num_players
          FROM public.team_player
          GROUP BY team_id
        ) AS tp_counts
          ON tp_counts.team_id = t.team_id

        /* aggregate tournament names into an array */
        LEFT JOIN (
          SELECT 
            tt.team_id,
            ARRAY_AGG(tr.tr_name ORDER BY tr.tr_name) AS tournaments
          FROM public.tournament_team tt
          JOIN public.tournament    tr ON tt.tr_id = tr.tr_id
          GROUP BY tt.team_id
        ) AS tr
          ON tr.team_id = t.team_id

        ORDER BY t.team_name;
      `;

      // 2) All tournaments for the dropdown/display
      const allTourSql = `
        SELECT tr_id, tr_name, start_date, end_date, status
        FROM public.tournament
        ORDER BY tr_id;
      `;

      const [
        { rows: teams },
        { rows: tournaments }
      ] = await Promise.all([
        query(teamsSql),
        query(allTourSql)
      ]);

      return res.json({ teams, tournaments });

    } catch (err) {
      console.error('Error fetching admin teams:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


// Create a new team
app.post(
  '/api/admin/teams',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { team_name } = req.body;

    // Basic validation
    if (!team_name) {
      return res
        .status(400)
        .json({ error: 'team_name is required' });
    }

    try {
      // 1) Fetch current max team_id (numeric comes back as string)
      const maxRes = await query(
        'SELECT COALESCE(MAX(team_id), 0) AS max_id FROM public.team'
      );
      const maxId  = parseInt(maxRes.rows[0].max_id, 10);
      const nextId = maxId + 1;

      // 2) Insert the new team
      const insertSql = `
        INSERT INTO public.team (team_id, team_name)
        VALUES ($1, $2)
        RETURNING team_id, team_name;
      `;
      const { rows } = await query(insertSql, [
        nextId,
        team_name
      ]);

      // 3) Respond with the newly created team
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating team:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


// update a team
app.put(
  '/api/admin/teams/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    const sql = `
      UPDATE public.team
      SET team_name = $1, status = $2
      WHERE team_id = $3;
    `;

    try {
      await query(sql, [name, status, id]);
      return res.json({ message: 'Team updated successfully' });
    } catch (err) {
      console.error('Error updating team:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// delete a team
app.delete(
  '/api/admin/teams/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const sql = `
      DELETE FROM public.team
      WHERE team_id = $1;
    `;

    try {
      await query(sql, [id]);
      return res.json({ message: 'Team deleted successfully' });
    } catch (err) {
      console.error('Error deleting team:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// add team to tournament
app.post(
  '/api/admin/teams/add-to-tournament',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { team_id, tr_id } = req.body;

    // 1) validate inputs
    if (!team_id || !tr_id) {
      return res
        .status(400)
        .json({ error: 'team_id and tr_id are required' });
    }

    try {
      // 2) prevent duplicates
      const { rows: existing } = await query(
        `SELECT 1
           FROM public.tournament_team
          WHERE team_id = $1
            AND tr_id   = $2`,
        [team_id, tr_id]
      );
      if (existing.length) {
        return res
          .status(409)
          .json({ error: 'That team is already in this tournament' });
      }

      // 3) insert with default stats = 0
      const insertSql = `
      INSERT INTO public.tournament_team (team_id, tr_id)
      VALUES ($1, $2)
      RETURNING team_id, tr_id;
      `;
      const { rows } = await query(insertSql, [
        team_id,
        tr_id,
      ]);

      // 4) respond with the new link
      return res.status(201).json(rows[0]);

    } catch (err) {
      console.error('Error adding team to tournament:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// assign a captain to a team
app.post(
  '/api/admin/teams/assign-captain',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { team_id, player_id } = req.body;

    if (!team_id || !player_id) {
      return res.status(400).json({ error: 'team_id and player_id are required' });
    }

    const sql = `
      UPDATE public.team
      SET captain = $1
      WHERE team_id = $2
      RETURNING team_id, captain;
    `;

    try {
      const { rows } = await query(sql, [player_id, team_id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }

      return res.json({ message: 'Captain assigned successfully', data: rows[0] });
    } catch (err) {
      console.error('Error assigning captain:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

//////////// Join a team route \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// team request page 
app.get(
  '/api/teams/join-request',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // 1) Fetch all teams
      const teamsQ = `
        SELECT team_id, team_name
        FROM public.team
        ORDER BY team_name;
      `;

      // 2) Fetch all positions
      const positionsQ = `
        SELECT position_id, position_desc
        FROM public.playing_position
        ORDER BY position_desc;
      `;

      const [
        { rows: teams },
        { rows: positions }
      ] = await Promise.all([
        query(teamsQ),
        query(positionsQ)
      ]);

      return res.json({ teams, positions });
    } catch (err) {
      console.error('Error fetching join-request metadata:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Join a team request
// This route allows a player to send a join request to a team
app.post(
  '/api/teams/join-request',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const player_id = req.user.id;           // from JWT
    const { team_id, requested_position } = req.body;

    if (!team_id || !requested_position) {
      return res
        .status(400)
        .json({ error: 'team_id and requested_position are required' });
    }

    try {
      const insertSql = `
        INSERT INTO public.team_join_requests
          (player_id, team_id, requested_position)
        VALUES ($1, $2, $3)
        RETURNING request_id, status;
      `;
      const { rows } = await query(insertSql, [
        player_id,
        team_id,
        requested_position
      ]);
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating join request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// =================== MATCH MANAGEMENT ENDPOINTS ===================

// Get all matches for a tournament
app.get('/api/tournaments/:trId/matches', async (req, res) => {
  const { trId } = req.params;
  
  try {
    // Join match_played with team and venue tables to get team names and venue name
    const result = await query(
      `SELECT mp.match_no, mp.play_stage, mp.play_date, 
        mp.team_id1, t1.team_name as team1_name, 
        mp.team_id2, t2.team_name as team2_name, 
        mp.results, mp.goal_score, 
        mp.venue_id, v.venue_name, 
        mp.audience, mp.player_of_match
      FROM match_played mp
      JOIN team t1 ON mp.team_id1 = t1.team_id
      JOIN team t2 ON mp.team_id2 = t2.team_id
      JOIN venue v ON mp.venue_id = v.venue_id
      WHERE mp.team_id1 IN (SELECT team_id FROM tournament_team WHERE tr_id = $1)
         OR mp.team_id2 IN (SELECT team_id FROM tournament_team WHERE tr_id = $1)
      ORDER BY mp.play_date DESC, mp.match_no DESC`,
      [trId]
    );
    
    // Format the results for better display
    const formattedMatches = result.rows.map(match => ({
      ...match,
      play_date: match.play_date, // Keep ISO format for frontend processing
      formatted_date: new Date(match.play_date).toLocaleDateString(),
      score: match.goal_score,
    }));
    
    return res.json(formattedMatches);
  } catch (err) {
    console.error('Error fetching tournament matches:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific match details
app.get('/api/matches/:matchNo', async (req, res) => {
  const { matchNo } = req.params;
  
  try {
    // Get main match information
    const matchQuery = await query(
      `SELECT mp.match_no, mp.play_date, 
        mp.team_id1, t1.team_name as team1_name, 
        mp.team_id2, t2.team_name as team2_name, 
        mp.results, mp.goal_score, 
        mp.venue_id, v.venue_name, 
        mp.audience, mp.player_of_match, mp.decided_by, 
        mp.stop1_sec, mp.stop2_sec
      FROM match_played mp
      JOIN team t1 ON mp.team_id1 = t1.team_id
      JOIN team t2 ON mp.team_id2 = t2.team_id
      JOIN venue v ON mp.venue_id = v.venue_id
      WHERE mp.match_no = $1`,
      [matchNo]
    );
    
    if (matchQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const match = matchQuery.rows[0];
    
    // Get match details for both teams
    const detailsQuery = await query(
      `SELECT * FROM match_details WHERE match_no = $1`,
      [matchNo]
    );
    
    // Get match captains
    const captainsQuery = await query(
      `SELECT mc.team_id, mc.player_captain, COALESCE(u.first_name || ' ' || u.last_name, 'Unknown') as captain_name
      FROM match_captain mc
      LEFT JOIN player p ON mc.player_captain = p.player_id
      LEFT JOIN users u ON p.player_id = u.id
      WHERE mc.match_no = $1`,
      [matchNo]
    );
    
    // Get goals in this match
    const goalsQuery = await query(
      `SELECT gd.goal_id, gd.team_id, gd.player_id, 
        COALESCE(u.first_name || ' ' || u.last_name, 'Unknown') as player_name,
        gd.goal_time, gd.goal_type, gd.play_stage, gd.goal_schedule, gd.goal_half
      FROM goal_details gd
      LEFT JOIN player p ON gd.player_id = p.player_id
      LEFT JOIN users u ON p.player_id = u.id
      WHERE gd.match_no = $1
      ORDER BY gd.goal_time`,
      [matchNo]
    );
    
    // Get player bookings in this match
    const bookingsQuery = await query(
      `SELECT pb.player_id, pb.team_id, 
        COALESCE(u.first_name || ' ' || u.last_name, 'Unknown') as player_name,
        pb.booking_time, pb.sent_off, pb.play_schedule, pb.play_half
      FROM player_booked pb
      LEFT JOIN player p ON pb.player_id = p.player_id
      LEFT JOIN users u ON p.player_id = u.id
      WHERE pb.match_no = $1
      ORDER BY pb.booking_time`,
      [matchNo]
    );
    
    // Combine all data
    const matchDetails = {
      ...match,
      details: detailsQuery.rows,
      captains: captainsQuery.rows,
      goals: goalsQuery.rows,
      bookings: bookingsQuery.rows
    };
    
    return res.json(matchDetails);
  } catch (err) {
    console.error('Error fetching match details:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new match for a tournament
app.post('/api/tournaments/:trId/matches', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
  const { trId } = req.params;
  const { play_date, team_id1, team_id2, play_stage, venue_id, results, decided_by, goal_score, audience, player_of_match, stop1_sec, stop2_sec } = req.body;

  try {
    const tournamentExists = await query('SELECT * FROM tournament WHERE tr_id = $1', [trId]);
    if (tournamentExists.rows.length === 0) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check that both teams exist in the tournament
    const team1Check = await query('SELECT * FROM tournament_team WHERE tr_id = $1 AND team_id = $2', [trId, team_id1]);
    const team2Check = await query('SELECT * FROM tournament_team WHERE tr_id = $1 AND team_id = $2', [trId, team_id2]);

    if (team1Check.rows.length === 0 || team2Check.rows.length === 0) {
      return res.status(400).json({ message: 'One or both teams are not participating in this tournament' });
    }

    // Get the next match_no
    const maxMatchNoResult = await query('SELECT MAX(match_no) FROM match_played');
    const maxMatchNo = maxMatchNoResult.rows[0].max || 0;
    const newMatchNo = maxMatchNo + 1;

    // First get valid player_id values from the database
    const playerQuery = await query('SELECT player_id FROM player LIMIT 1');
    let validPlayerId = null;
    
    if (playerQuery.rows.length > 0) {
      validPlayerId = playerQuery.rows[0].player_id;
    }
    
    // Insert the new match
    let newMatch;
    
    if (validPlayerId) {
      // If we have a valid player, use it for player_of_match
      newMatch = await query(
        'INSERT INTO match_played (match_no, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, player_of_match, stop1_sec, stop2_sec) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [newMatchNo, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, validPlayerId, stop1_sec || 0, stop2_sec || 0]
      );
    } else {
      // If we couldn't find a valid player, attempt an insert without the player_of_match field
      // This requires your DB schema to allow NULL for this field, or for it to have a DEFAULT value set
      newMatch = await query(
        'INSERT INTO match_played (match_no, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, stop1_sec, stop2_sec) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [newMatchNo, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, stop1_sec || 0, stop2_sec || 0]
      );
    }

    // If match has a score (not a future match), update league standings
    if (goal_score && goal_score !== '0-0' && goal_score !== 'N/A') {
      await updateLeagueStandings(trId);
    }

    res.status(201).json(newMatch.rows[0]);
  } catch (err) {
    console.error('Error creating match:', err);
    res.status(500).json({ message: 'Failed to create match', error: err.message });
  }
});

// Update a match
app.put('/api/matches/:matchNo', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { matchNo } = req.params;
  const { play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, player_of_match, stop1_sec, stop2_sec } = req.body;

  try {
    // Check if match exists
    const matchExists = await query('SELECT * FROM match_played WHERE match_no = $1', [matchNo]);
    if (matchExists.rows.length === 0) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Get tournament ID from tournament_team using one of the teams
    const teamTournamentQuery = await query('SELECT tr_id FROM tournament_team WHERE team_id = $1 LIMIT 1', [team_id1]);
    const trId = teamTournamentQuery.rows[0]?.tr_id;

    // First get valid player_id values from the database
    const playerQuery = await query('SELECT player_id FROM player LIMIT 1');
    let validPlayerId = null;
    
    if (playerQuery.rows.length > 0) {
      validPlayerId = playerQuery.rows[0].player_id;
    }
    
    // Update the match
    let updatedMatch;
    
    if (validPlayerId) {
      // If we have a valid player, use it for player_of_match
      updatedMatch = await query(
        'UPDATE match_played SET play_date = $1, team_id1 = $2, team_id2 = $3, venue_id = $4, results = $5, decided_by = $6, goal_score = $7, audience = $8, player_of_match = $9, stop1_sec = $10, stop2_sec = $11 WHERE match_no = $12 RETURNING *',
        [play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, validPlayerId, stop1_sec || 0, stop2_sec || 0, matchNo]
      );
    } else {
      // If we couldn't find a valid player, attempt an update without the player_of_match field
      updatedMatch = await query(
        'UPDATE match_played SET play_date = $1, team_id1 = $2, team_id2 = $3, venue_id = $4, results = $5, decided_by = $6, goal_score = $7, audience = $8, stop1_sec = $9, stop2_sec = $10 WHERE match_no = $11 RETURNING *',
        [play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, stop1_sec || 0, stop2_sec || 0, matchNo]
      );
    }

    // If match has a score, update league standings
    if (goal_score && goal_score !== '0-0' && goal_score !== 'N/A') {
      await updateLeagueStandings(trId);
    }

    res.json(updatedMatch.rows[0]);
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(500).json({ message: 'Failed to update match', error: err.message });
  }
});

// Function to update league standings for a tournament
async function updateLeagueStandings(tournamentId) {
  try {
    // Get all teams in this tournament
    const teamsResult = await query(
      'SELECT team_id FROM tournament_team WHERE tr_id = $1',
      [tournamentId]
    );

    // For each team, calculate their statistics
    for (const team of teamsResult.rows) {
      const teamId = team.team_id;
      
      // Get all matches for this team in this tournament
      const matchesResult = await query(
        `SELECT * FROM match_played 
         WHERE tr_id = $1 AND (team_id1 = $2 OR team_id2 = $2) 
         AND goal_score IS NOT NULL AND goal_score != '0-0' AND goal_score != 'N/A'`,
        [tournamentId, teamId]
      );
      
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      
      // Calculate statistics based on matches
      matchesResult.rows.forEach(match => {
        played++;
        
        // Parse goal score (format: '2-1')
        const scores = match.goal_score.split('-');
        const score1 = parseInt(scores[0]);
        const score2 = parseInt(scores[1]);
        
        // Determine if this team is team1 or team2
        if (match.team_id1 === teamId) {
          // This team is team1
          goalsFor += score1;
          goalsAgainst += score2;
          
          if (score1 > score2) won++;
          else if (score1 < score2) lost++;
          else drawn++;
        } else {
          // This team is team2
          goalsFor += score2;
          goalsAgainst += score1;
          
          if (score2 > score1) won++;
          else if (score2 < score1) lost++;
          else drawn++;
        }
      });
      
      // Calculate points (3 for win, 1 for draw)
      const points = (won * 3) + drawn;
      const goalDifference = goalsFor - goalsAgainst;
      
      // Check if standing exists for this team and tournament
      const standingExists = await query(
        'SELECT * FROM league_standings WHERE tr_id = $1 AND team_id = $2',
        [tournamentId, teamId]
      );
      
      if (standingExists.rows.length > 0) {
        // Update existing standing
        await query(
          `UPDATE league_standings 
           SET played = $1, won = $2, drawn = $3, lost = $4, 
               goals_for = $5, goals_against = $6, goal_difference = $7, points = $8 
           WHERE tr_id = $9 AND team_id = $10`,
          [played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points, tournamentId, teamId]
        );
      } else {
        // Insert new standing
        await query(
          `INSERT INTO league_standings 
           (tr_id, team_id, played, won, drawn, lost, goals_for, goals_against, goal_difference, points) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [tournamentId, teamId, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points]
        );
      }
    }
    
    // Update positions based on points and goal difference
    await query(
      `WITH ranked_standings AS (
         SELECT 
           standing_id, 
           ROW_NUMBER() OVER (PARTITION BY tr_id ORDER BY points DESC, goal_difference DESC, goals_for DESC) as new_position 
         FROM league_standings 
         WHERE tr_id = $1
       )
       UPDATE league_standings ls 
       SET position = rs.new_position 
       FROM ranked_standings rs 
       WHERE ls.standing_id = rs.standing_id`,
      [tournamentId]
    );
    
    console.log(`Updated league standings for tournament ${tournamentId}`);
    return true;
  } catch (err) {
    console.error('Error updating league standings:', err);
    return false;
  }
}

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

// Endpoint to manually trigger standings recalculation
app.post('/api/tournaments/:trId/recalculate-standings', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
  const { trId } = req.params;
  
  try {
    const success = await updateLeagueStandings(trId);
    if (success) {
      res.json({ message: 'Standings recalculated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to recalculate standings' });
    }
  } catch (err) {
    console.error('Error recalculating standings:', err);
    res.status(500).json({ message: 'Failed to recalculate standings', error: err.message });
  }
});

// Get venues for match dropdown
app.get('/api/venues', async (req, res) => {
  try {
    const result = await query(
      `SELECT venue_id, venue_name, venue_capacity 
       FROM venue 
       WHERE venue_status = 'A' 
       ORDER BY venue_name`
    );
    
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching venues:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



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

////////////////////// User management routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Get all users (admin only)
app.get(
  '/admin/users',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const sql = `
      SELECT id, first_name, last_name, email, user_type
      FROM public.users;
    `;

    try {
      const { rows } = await query(sql);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// Update user type (admin only)
app.put(
  '/admin/users/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { user_type } = req.body;
    const sql = `
      UPDATE public.users
      SET user_type = $1
      WHERE id = $2;
    `;

    try {
      await query(sql, [user_type, id]);
      return res.json({ message: 'User type updated successfully' });
    } catch (err) {
      console.error('Error updating user type:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// Delete a user (admin only)
app.delete(
  '/admin/users/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const { id } = req.params;
    const sql = `
      DELETE FROM public.users
      WHERE id = $1;
    `;

    try {
      await query(sql, [id]);
      return res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
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

// Endpoint to manually trigger standings recalculation
app.post('/api/tournaments/:trId/recalculate-standings', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
  const { trId } = req.params;
  
  try {
    const success = await updateLeagueStandings(trId);
    if (success) {
      res.json({ message: 'Standings recalculated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to recalculate standings' });
    }
  } catch (err) {
    console.error('Error recalculating standings:', err);
    res.status(500).json({ message: 'Failed to recalculate standings', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});