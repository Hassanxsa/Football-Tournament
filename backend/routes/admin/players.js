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



//////////// player routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Get player requests  (admin only - pending and accepted)
router.get(
  '/requests',
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

// Create a new player
router.post(
    '/',
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
  router.put(
    '/:id',
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
  router.delete(
    '/:id',
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

  // add a yellow / red card to a player
  router.post(
  '/:id/cards',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  async (req, res) => {
    const player_id = parseInt(req.params.id, 10);
    const { color, minute, match_no } = req.body;

    // 1) Validate
    if (!color || minute == null || !match_no) {
      return res
        .status(400)
        .json({ error: 'color, minute and match_no are required' });
    }

    try {
      // 2) Insert into card table
      const sql = `
        INSERT INTO public.card
          (color, minute, player_id, match_no)
        VALUES ($1, $2, $3, $4)
        RETURNING id, color, minute, player_id, match_no;
      `;
      const params = [color, parseInt(minute, 10), player_id, parseInt(match_no, 10)];
      const { rows } = await query(sql, params);

      // 3) Respond with the created card
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating card:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

  
  







export default router;