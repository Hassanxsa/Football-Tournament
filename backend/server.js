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
import { query } from './db/connectPostgres.js';
import axios from 'axios';
const PORT = process.env.PORT || 5000;


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

// signup route

app.post('/api/signup', async (req, res) => {
  const {first_name, last_name, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Extract KFUPM ID from email (e.g., "s202272000@kfupm.edu.sa")
  const match = email.match(/^s(\d{9})@kfupm\.edu\.sa$/);
  if (!match) {
    return res.status(400).json({ message: 'Invalid KFUPM email format' });
  }
  const kfupmId = parseInt(match[1]); // This will be 202272000


  try {
    await query(
      'INSERT INTO users (id, first_name, last_name, email, password, user_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [kfupmId, first_name, last_name, email, hashedPassword, 'guest']
    );
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });

  }
}
);

// login route

app.post('/api/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    });
  })(req, res);
});

// welcome test route
app.get('/', (req, res) => {
  res.send('Welcome to the Football Tournament API!');
});




// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  const userId = req.user.id;
  query('SELECT user_type FROM users WHERE id = $1', [userId])
    .then(result => {
      if (result.rows.length > 0 && result.rows[0].user_type === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
};

//main pages routes (view tournaments, teams, players, venues, home)

// tournaments route

app.get(
  '/api/tournaments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const sql = `
      SELECT
        t.tr_id,
        t.tr_name,
        t.start_date,
        t.end_date,
        t.status,
        COALESCE(tt_counts.num_teams, 0)   AS num_teams,
        COALESCE(mp_counts.num_matches, 0) AS num_matches
      FROM public.tournament AS t

      /* count teams per tournament */
      LEFT JOIN (
        SELECT
          tr_id,
          COUNT(*) AS num_teams
        FROM public.tournament_team
        GROUP BY tr_id
      ) AS tt_counts
        ON tt_counts.tr_id = t.tr_id

      /* count distinct matches per tournament */
      LEFT JOIN (
        SELECT
          tt.tr_id,
          COUNT(DISTINCT m.match_no) AS num_matches
        FROM public.match_played AS m
        JOIN public.tournament_team AS tt
          ON tt.team_id IN (m.team_id1, m.team_id2)
        GROUP BY tt.tr_id
      ) AS mp_counts
        ON mp_counts.tr_id = t.tr_id

      ORDER BY t.tr_id;
    `;

    try {
      const { rows } = await query(sql);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// teams route

app.get(
  '/api/teams',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // Grab the optional search term
    const { search } = req.query;

    // Build WHERE clause and parameter array
    const conditions = [];
    const values     = [];

    if (search) {
      // ILIKE for case-insensitive substring match
      conditions.push(`t.team_name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }

    // Assemble the full SQL
    const sql = `
      SELECT
        t.team_id,
        t.team_name,
        t.status,
        COALESCE(tr_counts.num_tournaments, 0) AS num_tournaments,
        COALESCE(pl_counts.num_players,    0) AS num_players,
        COALESCE(mt_counts.num_matches,   0) AS num_matches
      FROM public.team AS t

      /* tournaments per team */
      LEFT JOIN (
        SELECT team_id, COUNT(*) AS num_tournaments
        FROM public.tournament_team
        GROUP BY team_id
      ) AS tr_counts
        ON tr_counts.team_id = t.team_id

      /* players per team */
      LEFT JOIN (
        SELECT team_id, COUNT(DISTINCT player_id) AS num_players
        FROM public.team_player
        GROUP BY team_id
      ) AS pl_counts
        ON pl_counts.team_id = t.team_id

      /* matches per team */
      LEFT JOIN (
        SELECT
          mp.team_id,
          COUNT(DISTINCT mp.match_no) AS num_matches
        FROM (
          SELECT match_no, team_id1 AS team_id FROM public.match_played
          UNION ALL
          SELECT match_no, team_id2 AS team_id FROM public.match_played
        ) AS mp
        GROUP BY mp.team_id
      ) AS mt_counts
        ON mt_counts.team_id = t.team_id

      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY t.team_name;
    `;

    try {
      const { rows } = await query(sql, values);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// players route
app.get(
  '/api/players',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { search, position } = req.query;
    const conditions = [];
    const values     = [];

    // name search
    if (search) {
      conditions.push(`(u.first_name || ' ' || u.last_name) ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }
    // position filter
    if (position) {
      conditions.push(`p.position_to_play = $${values.length + 1}`);
      values.push(position);
    }

    const sql = `
      SELECT
        u.id                                              AS player_id,
        u.first_name || ' ' || u.last_name                AS player_name,
        u.date_of_birth,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.date_of_birth))::INT AS age,
        pos.position_desc                                 AS position,
        COALESCE(
          STRING_AGG(DISTINCT t.team_name, ', '),
          ''
        )                                                 AS teams
      FROM public.player         AS p
      JOIN public.users          AS u
        ON p.player_id = u.id
      JOIN public.playing_position AS pos
        ON p.position_to_play = pos.position_id
      LEFT JOIN public.team_player AS tp
        ON tp.player_id = p.player_id
      LEFT JOIN public.team        AS t
        ON t.team_id = tp.team_id

      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}

      GROUP BY
        u.id,
        u.first_name,
        u.last_name,
        u.date_of_birth,
        pos.position_desc

      ORDER BY u.last_name, u.first_name;
    `;

    try {
      const { rows } = await query(sql, values);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching players:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


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

// home route
app.get(
  '/api/home',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // 1. Active tournaments
      const activeTournamentsQ = `
        SELECT
          tr_id   AS id,
          tr_name AS name,
          start_date,
          end_date
        FROM public.tournament AS t
        WHERE t.status = 'active'
        ORDER BY start_date;
      `;

      // 3. Ten most recent matches
      const recentMatchesQ = `
        SELECT
          m.match_no,
          m.play_stage,
          m.play_date,
          t1.team_name AS team1,
          t2.team_name AS team2,
          v.venue_name AS venue,
          m.results
        FROM public.match_played AS m
        JOIN public.team   AS t1 ON m.team_id1 = t1.team_id
        JOIN public.team   AS t2 ON m.team_id2 = t2.team_id
        JOIN public.venue  AS v  ON m.venue_id  = v.venue_id
        ORDER BY m.play_date DESC
        LIMIT 10;
      `;

      // 4. Participating teams in active tournaments (up to 10)
      const participatingTeamsQ = `
        SELECT DISTINCT
          t.team_id,
          t.team_name
        FROM public.team            AS t
        
        
        WHERE t.status = 'active'
        ORDER BY t.team_name
        LIMIT 10;
      `;

      const [
        { rows: activeTournaments },
        { rows: recentMatches },
        { rows: participatingTeams }
      ] = await Promise.all([
        query(activeTournamentsQ),
        query(recentMatchesQ),
        query(participatingTeamsQ)
      ]);

      return res.json({
        activeTournaments,
        tournamentStandings: [],      // TODO: implement standings query
        recentMatches,
        participatingTeams
      });
    } catch (err) {
      console.error('Error fetching home data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


//////////////////////////// specific id routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Get a specific tournament by ID
// 1) Tournament details
app.get(
  '/api/tournaments/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const trId = Number(req.params.id);
    if (Number.isNaN(trId)) {
      return res.status(400).json({ error: 'Invalid tournament ID' });
    }

    const sql = `
      SELECT
        tr_id,
        tr_name,
        start_date,
        end_date,
        status
      FROM public.tournament
      WHERE tr_id = $1
    `;

    try {
      const { rows } = await query(sql, [trId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('GET /api/tournaments/:id error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 2) Teams in tournament
app.get(
  '/api/tournaments/:id/teams',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const trId = Number(req.params.id);
    if (Number.isNaN(trId)) {
      return res.status(400).json({ error: 'Invalid tournament ID' });
    }

    const sql = `
      SELECT
        t.team_id,
        t.team_name,
        tt.team_group,
        tt.match_played,
        tt.won,
        tt.draw,
        tt.lost,
        tt.goal_for,
        tt.goal_against,
        tt.goal_diff,
        tt.points
      FROM public.tournament_team tt
      JOIN public.team              t ON tt.team_id = t.team_id
      WHERE tt.tr_id = $1
      ORDER BY tt.group_position, t.team_name;
    `;

    try {
      const { rows } = await query(sql, [trId]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/tournaments/:id/teams error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 3) Matches in tournament
app.get(
  '/api/tournaments/:id/matches',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const trId = Number(req.params.id);
    if (Number.isNaN(trId)) {
      return res.status(400).json({ error: 'Invalid tournament ID' });
    }

    const sql = `
      SELECT
        m.match_no,
        m.play_stage,
        m.play_date,
        m.team_id1,
        t1.team_name AS team_name1,
        m.team_id2,
        t2.team_name AS team_name2,
        m.venue_id,
        v.venue_name,
        -- results or goal_score?
        m.goal_score,
        -- derive a simple status
        CASE
          WHEN m.play_date <= CURRENT_DATE THEN 'completed'
          ELSE 'scheduled'
        END AS status
      FROM public.match_played m
      JOIN public.tournament_team tt1
        ON tt1.team_id = m.team_id1 AND tt1.tr_id = $1
      JOIN public.tournament_team tt2
        ON tt2.team_id = m.team_id2 AND tt2.tr_id = $1
      JOIN public.team   t1 ON m.team_id1 = t1.team_id
      JOIN public.team   t2 ON m.team_id2 = t2.team_id
      JOIN public.venue  v  ON m.venue_id  = v.venue_id
      ORDER BY m.play_date DESC
      LIMIT 10;
    `;

    try {
      const { rows } = await query(sql, [trId]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/tournaments/:id/matches error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Get a specific team by ID


///////////////////////////////////////// Admin routes /////////////////////////////////////////
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








  
















































// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});