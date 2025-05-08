import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import passport from '../../config/passport.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import logger from 'morgan'
import jwt from 'jsonwebtoken';
import cors from 'cors';  // Import cors
import axios from 'axios';
import { query } from '../middleware/db.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const router = express.Router();



router.get(
  '/',
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

// 2) Team details

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const { id } = req.params;
      const sql = `
        SELECT
          t.team_id,
          t.team_name,
          t.status,
          t.captain,
          COALESCE(u.first_name || ' ' || u.last_name, '') AS captain_name
        FROM public.team AS t
        LEFT JOIN public.player AS p
          ON t.captain = p.player_id
        LEFT JOIN public.users AS u
          ON p.player_id = u.id
        WHERE t.team_id = $1;
      `;
      try {
        const { rows } = await query(sql, [id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Team not found' });
        }
        res.json(rows[0]);
      } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );

// 3) GET /api/teams/:id/players
//    All players on this team
router.get(
  '/:id/players',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const teamId = Number(req.params.id);
    if (Number.isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    try {
      const sql = `
        SELECT
          u.id                                        AS player_id,
          u.first_name || ' ' || u.last_name          AS name,
          u.date_of_birth,
          p.jersey_no,
          pos.position_desc,
          p.position_to_play
        FROM public.team_player tp
        JOIN public.player           p   ON tp.player_id = p.player_id
        JOIN public.users            u   ON p.player_id = u.id
        JOIN public.playing_position pos ON p.position_to_play = pos.position_id
        WHERE tp.team_id = $1
        ORDER BY u.last_name, u.first_name;
      `;
      const { rows } = await query(sql, [teamId]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/teams/:id/players error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 4) GET /api/teams/:id/matches
router.get(
  '/:id/matches',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const teamId = Number(req.params.id);
    if (Number.isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    try {
      const sql = `
        SELECT
          m.match_no,
          m.play_date,
          m.team_id1,
          t1.team_name AS team_name1,
          m.team_id2,
          t2.team_name AS team_name2,
          v.venue_name,
          m.goal_score,
          CASE
            WHEN m.play_date <= CURRENT_DATE THEN 'completed'
            ELSE 'scheduled'
          END AS status
        FROM public.match_played m
        JOIN public.team  t1 ON m.team_id1 = t1.team_id
        JOIN public.team  t2 ON m.team_id2 = t2.team_id
        JOIN public.venue v   ON m.venue_id  = v.venue_id
        WHERE m.team_id1 = $1
           OR m.team_id2 = $1
        ORDER BY m.play_date DESC;
      `;
      const { rows } = await query(sql, [teamId]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/teams/:id/matches error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 5) GET /api/teams/:id/tournaments
//    All tournaments this team participates in, with stats
router.get(
  '/:id/tournaments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const teamId = Number(req.params.id);
    if (Number.isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    try {
      const sql = `
        SELECT
          tr.tr_id,
          tr.tr_name,
          tt.match_played,
          tt.won,
          tt.draw,
          tt.lost,
          tt.goal_for,
          tt.goal_against,
          tt.goal_diff,
          tt.points
        FROM public.tournament_team tt
        JOIN public.tournament tr
          ON tt.tr_id = tr.tr_id
        WHERE tt.team_id = $1
        ORDER BY tr.start_date;
      `;
      const { rows } = await query(sql, [teamId]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/teams/:id/tournaments error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


/////////////////////// Team Join Requests ///////////////////////
// team request page 
router.get(
  '/join-request',
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
router.post(
  '/join-request',
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


export default router;