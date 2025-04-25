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

app.post('/signup', async (req, res) => {
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

app.post('/login', (req, res) => {
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

/////////////////////////////////////////////main pages routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// tournaments route

app.get(
  '/tournaments',
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
  '/teams',
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
  '/players',
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
  '/venues',
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
  '/home',
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

///////////////////////////////////////////// specific id routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// player by id route
app.get(
  '/players/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const playerId = Number(req.params.id);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }

    try {
      // 1) Basic info + teams + position + age
      const infoSql = `
        SELECT
          u.first_name,
          u.last_name,
          u.id               AS player_id,
          p.jersey_no,
          u.date_of_birth,
          EXTRACT(YEAR FROM AGE(CURRENT_DATE, u.date_of_birth))::INT AS age,
          pos.position_desc  AS position,
          COALESCE(
            ARRAY_AGG(DISTINCT t.team_name)
            FILTER (WHERE t.team_name IS NOT NULL),
            '{}'
          ) AS teams
        FROM public.player       AS p
        JOIN public.users        AS u ON p.player_id = u.id
        JOIN public.playing_position AS pos
          ON p.position_to_play = pos.position_id
        LEFT JOIN public.team_player AS tp
          ON tp.player_id = p.player_id
        LEFT JOIN public.team        AS t
          ON t.team_id = tp.team_id
        WHERE u.id = $1
        GROUP BY u.first_name, u.last_name, u.id, p.jersey_no, u.date_of_birth, pos.position_desc
      `;

      // 2) Recent 5 matches for any team this player has been on
      const recentSql = `
        SELECT
          m.match_no,
          m.play_stage,
          m.play_date,
          t1.team_name AS team1,
          t2.team_name AS team2,
          v.venue_name AS venue,
          m.results
        FROM public.match_played AS m
        JOIN public.team AS t1 ON m.team_id1 = t1.team_id
        JOIN public.team AS t2 ON m.team_id2 = t2.team_id
        JOIN public.venue AS v  ON m.venue_id  = v.venue_id
        WHERE m.team_id1 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
           OR m.team_id2 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
        ORDER BY m.play_date DESC
        LIMIT 5
      `;

      // 3) Aggregate stats in one shot
      const statsSql = `
        SELECT
          /* goals scored */
          (SELECT COUNT(*) FROM public.goal_details WHERE player_id = $1) AS num_goals,

          /* placeholder  replace with your assists table if you add one */
          0 AS num_assists,

          /* distinct matches played */
          (SELECT COUNT(DISTINCT m.match_no)
           FROM public.match_played AS m
           WHERE m.team_id1 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
              OR m.team_id2 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
          ) AS matches_played,

          /* yellow / red cards from the new card table */
          (SELECT COUNT(*) FROM public.card WHERE player_id = $1 AND color = 'yellow') AS num_yellow_cards,
          (SELECT COUNT(*) FROM public.card WHERE player_id = $1 AND color = 'red')    AS num_red_cards
      `;

      // run in parallel
      const [
        { rows: infoRows },
        { rows: recentRows },
        { rows: statsRows }
      ] = await Promise.all([
        query(infoSql,    [playerId]),
        query(recentSql,  [playerId]),
        query(statsSql,   [playerId])
      ]);

      if (infoRows.length === 0) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const profile = {
        ...infoRows[0],
        recentMatches: recentRows,
        ...statsRows[0]
      };

      return res.json(profile);

    } catch (err) {
      console.error('Error in GET /players/:id', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);






  
















































// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});