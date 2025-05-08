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


// 1) GET /api/matches/:id — basic match info

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        m.match_no,
        m.play_date,
        m.team_id1,
        t1.team_name AS team_name1,
        m.team_id2,
        t2.team_name AS team_name2,
        v.venue_id,
        v.venue_name,
        m.results,
        m.goal_score,
        m.decided_by,
        m.audience,
        m.player_of_match,
        u.first_name || ' ' || u.last_name AS player_of_match_name,
        m.stop1_sec,
        m.stop2_sec,
        COALESCE(tr.tr_name, 'Unknown Tournament') AS tr_name
      FROM public.match_played m
      JOIN public.team   t1 ON m.team_id1 = t1.team_id
      JOIN public.team   t2 ON m.team_id2 = t2.team_id
      JOIN public.venue  v  ON m.venue_id  = v.venue_id
      LEFT JOIN public.player            p ON m.player_of_match = p.player_id
      LEFT JOIN public.users             u ON p.player_id        = u.id
      LEFT JOIN LATERAL (
        SELECT tr.tr_name
        FROM public.tournament_team tt
        JOIN public.tournament     tr ON tt.tr_id = tr.tr_id
        WHERE tt.team_id = m.team_id1
        LIMIT 1
      ) AS tr ON true
      WHERE m.match_no = $1
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      if (!rows.length) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('GET /api/matches/:id error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 2) GET /api/matches/:id/details — match_details entries
router.get(
  '/:id/details',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        md.match_no,
        md.team_id,
        t.team_name,
        md.win_lose,
        md.decided_by,
        md.goal_score,
        md.penalty_score,
        md.player_gk,
        u.first_name || ' ' || u.last_name AS player_gk_name
      FROM public.match_details md
      JOIN public.team   t ON md.team_id        = t.team_id
      JOIN public.player p ON md.player_gk      = p.player_id
      JOIN public.users   u ON p.player_id       = u.id
      WHERE md.match_no = $1
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/matches/:id/details error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 3) GET /api/matches/:id/goals — goal_details
router.get(
  '/:id/goals',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        gd.goal_id,
        gd.team_id,
        t.team_name,
        gd.player_id,
        u.first_name || ' ' || u.last_name AS player_name,
        gd.goal_time,
        gd.goal_type,
        gd.goal_schedule,
        gd.goal_half
      FROM public.goal_details gd
      JOIN public.team   t ON gd.team_id   = t.team_id
      JOIN public.player p ON gd.player_id = p.player_id
      JOIN public.users   u ON p.player_id  = u.id
      WHERE gd.match_no = $1
      ORDER BY gd.goal_time
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/matches/:id/goals error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 4) GET /api/matches/:id/bookings — player_booked
router.get(
  '/:id/bookings',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        pb.team_id,
        t.team_name,
        pb.player_id,
        u.first_name || ' ' || u.last_name AS player_name,
        pb.booking_time,
        pb.sent_off,
        pb.play_schedule,
        pb.play_half
      FROM public.player_booked pb
      JOIN public.team   t ON pb.team_id   = t.team_id
      JOIN public.player p ON pb.player_id = p.player_id
      JOIN public.users   u ON p.player_id  = u.id
      WHERE pb.match_no = $1
      ORDER BY pb.booking_time
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/matches/:id/bookings error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 5) GET /api/matches/:id/in-out — player_in_out
router.get(
  '/:id/substitutions',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        pi.team_id,
        t.team_name,
        pi.player_id,
        u.first_name || ' ' || u.last_name AS player_name,
        pi.in_out,
        pi.time_in_out,
        pi.play_schedule,
        pi.play_half
      FROM public.player_in_out pi
      JOIN public.team   t ON pi.team_id   = t.team_id
      JOIN public.player p ON pi.player_id = p.player_id
      JOIN public.users   u ON p.player_id  = u.id
      WHERE pi.match_no = $1
      ORDER BY pi.time_in_out
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/matches/:id/in-out error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 6) GET /api/matches/:id/captains — match_captain
router.get(
  '/:id/captains',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const matchNo = Number(req.params.id);
    if (Number.isNaN(matchNo)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const sql = `
      SELECT
        mc.team_id,
        t.team_name,
        mc.player_captain AS player_id,
        u.first_name || ' ' || u.last_name AS player_name
      FROM public.match_captain mc
      JOIN public.team   t ON mc.team_id         = t.team_id
      JOIN public.player p ON mc.player_captain = p.player_id
      JOIN public.users   u ON p.player_id        = u.id
      WHERE mc.match_no = $1
    `;

    try {
      const { rows } = await query(sql, [matchNo]);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/matches/:id/captains error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);





export default router;