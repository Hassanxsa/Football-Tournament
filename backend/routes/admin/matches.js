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

    // // 1) basic validation
    // if (!play_date || !team_id1 || !team_id2 || !result || !decided_by
    //   || goal_score1 == null || goal_score2 == null
    //   || !venue_id || !tr_id) {
    //   return res.status(400).json({ error: 'Missing required fields' });
    // }

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

//update match details
router.put(
  '/:match_no',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { match_no } = req.params;
    const {
      play_date,
      team_id1,
      team_id2,
      result,         // 'WIN' | 'DRAW' | 'LOSS' (from team1’s POV)
      decided_by,     // e.g. 'P'
      goal_score1,
      goal_score2,
      venue_id,
      audience,
      player_of_match,
      stop1_sec,
      stop2_sec,
      tr_id
    } = req.body;

    // // 1) basic validation
    // if (!play_date || !team_id1 || !team_id2 || !result || !decided_by
    //     || goal_score1 == null || goal_score2 == null
    //     || !venue_id || !tr_id) {
    //   return res.status(400).json({ error: 'Missing required fields' });
    // }

    // 2) derive W/D/L flags for each side
    let wl1, wl2;
    if (result === 'WIN')    { wl1 = 'W'; wl2 = 'L'; }
    else if (result === 'LOSS'){ wl1 = 'L'; wl2 = 'W'; }
    else                       { wl1 = wl2 = 'D'; }

    try {
      // 3) update the master record
      await query(`
        UPDATE public.match_played
           SET play_date        = $1
             , team_id1         = $2
             , team_id2         = $3
             , results          = $4
             , decided_by       = $5
             , goal_score       = $6
             , venue_id         = $7
             , audience         = $8
             , player_of_match  = $9
             , stop1_sec        = $10
             , stop2_sec        = $11
             , tr_id            = $12
         WHERE match_no = $13
      `, [
        play_date,
        team_id1,
        team_id2,
        result,
        decided_by,
        `${goal_score1}-${goal_score2}`,
        venue_id,
        audience || 0,
        player_of_match,
        stop1_sec   || 0,
        stop2_sec   || 0,
        tr_id,
        match_no
      ]);

      // 4) update the two detail rows
      await query(`
        UPDATE public.match_details
           SET win_lose   = $1
             , goal_score = $2
             , decided_by = $3
         WHERE match_no = $4
           AND team_id  = $5
      `, [ wl1, goal_score1, decided_by, match_no, team_id1 ]);

      await query(`
        UPDATE public.match_details
           SET win_lose   = $1
             , goal_score = $2
             , decided_by = $3
         WHERE match_no = $4
           AND team_id  = $5
      `, [ wl2, goal_score2, decided_by, match_no, team_id2 ]);

      return res.json({ match_no, message: 'Match updated successfully' });
    } catch (err) {
      console.error('Error updating match:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Record a new goal for a match
 * POST /api/admin/matches/goals
 */
router.post(
  '/goals',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const {
      match_no,
      player_id,
      team_id,
      goal_time,
      goal_type,
      play_stage,
      goal_schedule,
      goal_half
    } = req.body;

    // 1) basic validation
    if (
      !match_no ||
      !player_id ||
      !team_id ||
      goal_time == null ||
      !goal_type ||
      !play_stage ||
      !goal_schedule ||
      goal_half == null
    ) {
      return res.status(400).json({ error: 'All goal fields are required.' });
    }

    try {
      // 2) insert into goal_details
      const insertSql = `
        INSERT INTO public.goal_details
          (match_no, player_id, team_id, goal_time, goal_type, play_stage, goal_schedule, goal_half)
        VALUES
          ($1,       $2,        $3,      $4,        $5,        $6,         $7,            $8)
        RETURNING
          goal_id,
          match_no,
          player_id,
          team_id,
          goal_time,
          goal_type,
          play_stage,
          goal_schedule,
          goal_half;
      `;
      const { rows } = await query(insertSql, [
        parseInt(match_no, 10),
        parseInt(player_id, 10),
        parseInt(team_id, 10),
        parseInt(goal_time, 10),
        goal_type,
        play_stage,
        goal_schedule,
        parseInt(goal_half, 10),
      ]);

      // 3) respond with the newly created goal record
      return res.status(201).json({
        message: 'Goal recorded successfully.',
        goal: rows[0]
      });
    } catch (err) {
      console.error('Error inserting goal:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);














export default router;