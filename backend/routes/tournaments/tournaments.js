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
// 1) Tournament details
router.get(
  '/:id',
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

router.get(
  '/:id/teams',
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
        tt.group_position,
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
router.get(
  '/:id/matches',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const trId = Number(req.params.id);
    if (Number.isNaN(trId)) {
      return res.status(400).json({ error: 'Invalid tournament ID' });
    }

    const sql = `
          SELECT
        m.match_no,
        m.results,
        m.play_date,
        t1.team_name   AS team_name1,
        t2.team_name   AS team_name2,
        v.venue_name,
        m.goal_score,
        CASE
          WHEN m.play_date <= CURRENT_DATE THEN 'completed'
          ELSE 'scheduled'
        END AS status
      FROM public.match_played AS m

        -- make sure both sides are in this tournament
        JOIN public.tournament_team AS tt1
          ON tt1.team_id = m.team_id1
        AND tt1.tr_id   = $1

        JOIN public.tournament_team AS tt2
          ON tt2.team_id = m.team_id2
        AND tt2.tr_id   = $1

        -- pull team names
        JOIN public.team AS t1 ON t1.team_id = m.team_id1
        JOIN public.team AS t2 ON t2.team_id = m.team_id2

        -- pull venue
        JOIN public.venue AS v  ON v.venue_id = m.venue_id

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


// Endpoint to get league standings for a tournament
router.get('/:trId/standings', async (req, res) => {
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



export default router;