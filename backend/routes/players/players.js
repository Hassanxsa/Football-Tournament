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

// 1) Player details
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const playerId = Number(req.params.id);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const sql = `
      SELECT
        u.id                             AS player_id,
        u.first_name || ' ' || u.last_name AS name,
        p.jersey_no,
        u.date_of_birth,
        p.position_to_play,
        pos.position_desc,
        tp.team_id,
        t.team_name
      FROM public.player p
      JOIN public.users            u   ON p.player_id         = u.id
      JOIN public.playing_position pos ON p.position_to_play = pos.position_id
      LEFT JOIN public.team_player tp ON tp.player_id         = p.player_id
      LEFT JOIN public.team        t   ON tp.team_id           = t.team_id
      WHERE p.player_id = $1
      LIMIT 1
    `;

    try {
      const { rows } = await query(sql, [playerId]);
      if (!rows.length) {
        return res.status(404).json({ error: 'Player not found' });
      }
      return res.json(rows[0]);
    } catch (err) {
      console.error('GET /api/players/:id error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 2) Player matches
router.get(
  '/:id/matches',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const playerId = Number(req.params.id);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

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
      JOIN public.team   t1 ON m.team_id1 = t1.team_id
      JOIN public.team   t2 ON m.team_id2 = t2.team_id
      JOIN public.venue  v  ON m.venue_id  = v.venue_id
      WHERE m.team_id1 IN (
        SELECT team_id FROM public.team_player WHERE player_id = $1
      )
      OR   m.team_id2 IN (
        SELECT team_id FROM public.team_player WHERE player_id = $1
      )
      ORDER BY m.play_date DESC;
    `;

    try {
      const { rows } = await query(sql, [playerId]);
      return res.json(rows);
    } catch (err) {
      console.error('GET /api/players/:id/matches error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 3) GET /api/players/:id/stats — aggregate goals, cards, matches, clean sheets
router.get(
  '/:id/stats',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const playerId = Number(req.params.id);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const sql = `
      SELECT
        /* total goals */
        (SELECT COUNT(*) 
           FROM public.goal_details 
          WHERE player_id = $1
        ) AS goals,

        /* assists placeholder */
        0 AS assists,

        /* yellow / red cards */
        (SELECT COUNT(*) FROM public.card WHERE player_id = $1 AND color = 'yellow') AS yellow_cards,
        (SELECT COUNT(*) FROM public.card WHERE player_id = $1 AND color = 'red')    AS red_cards,

        /* matches played by their teams */
        (SELECT COUNT(DISTINCT m.match_no)
           FROM public.match_played m
          WHERE m.team_id1 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
             OR m.team_id2 IN (SELECT team_id FROM public.team_player WHERE player_id = $1)
        ) AS matches_played,

        /* clean sheets for goalkeepers */
        CASE
          WHEN p.position_to_play = 'GK' THEN
            (SELECT COUNT(*) 
               FROM public.match_details md
              WHERE md.player_gk = $1
                AND md.goal_score = 0
            )
          ELSE 0
        END AS clean_sheets

      FROM public.player p
      WHERE p.player_id = $1
    `;

    try {
      const { rows } = await query(sql, [playerId]);
      if (!rows.length) {
        // unlikely, but guard anyway
        return res.status(404).json({ error: 'Player not found' });
      }
      return res.json(rows[0]);
    } catch (err) {
      console.error('GET /api/players/:id/stats error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);




















export default router;


