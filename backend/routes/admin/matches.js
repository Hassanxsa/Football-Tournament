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



router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const {
      play_date,
      team_id1,
      team_id2,
      result,       // 'WIN', 'DRAW' or 'LOSS' (from team1's POV)
      decided_by,   // e.g. 'P'
      goal_score1,
      goal_score2,
      venue_id,
      audience,
      player_of_match,
      stop1_sec,
      stop2_sec,
      tr_id
    } = req.body;

    // 1) basic validation
    if (!play_date || !team_id1 || !team_id2 || !result || !decided_by
      || goal_score1 == null || goal_score2 == null
      || !venue_id || !tr_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // 2) fetch next match_no
      const nextRes = await query(`
        SELECT COALESCE(MAX(CAST(match_no AS INTEGER)),0) + 1 AS next_no
          FROM public.match_played
      `);
      const match_no = nextRes.rows[0].next_no;

      // 3) insert into match_played
      await query(`
  INSERT INTO public.match_played
    ( match_no
    , play_date
    , team_id1
    , team_id2
    , results
    , decided_by
    , goal_score
    , venue_id
    , audience
    , player_of_match
    , stop1_sec
    , stop2_sec
    , tr_id
    )
  VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
`, [
  match_no,
  play_date,
  team_id1,
  team_id2,
  // results column holds the raw string "X‑Y"
  result,
  decided_by,
  // goal_score stored as same "X‑Y" string
  `${goal_score1}-${goal_score2}`,
  venue_id,
  audience || 0,
  player_of_match,
  stop1_sec   || 0,
  stop2_sec   || 0,
  tr_id
]);

      // 4) derive W/D/L flags
      let wl1, wl2;
      if (result === 'WIN')    { wl1 = 'W'; wl2 = 'L'; }
      else if (result === 'LOSS'){ wl1 = 'L'; wl2 = 'W'; }
      else                       { wl1 = wl2 = 'D'; }

      // 5) insert into match_details for team1
      await query(`
        INSERT INTO public.match_details
          (match_no, team_id, win_lose, goal_score, decided_by)
        VALUES ($1,$2,$3,$4,$5)
      `, [match_no, team_id1, wl1, goal_score1, decided_by]);

      // 6) insert into match_details for team2
      await query(`
        INSERT INTO public.match_details
          (match_no, team_id, win_lose, goal_score, decided_by)
        VALUES ($1,$2,$3,$4,$5)
      `, [match_no, team_id2, wl2, goal_score2, decided_by]);

      // 7) respond
      return res.status(201).json({ match_no, message: 'Match created' });

    } catch (err) {
      console.error('Error creating match:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);












export default router;