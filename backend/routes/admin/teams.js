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




/////////////////////////  team routes \\\\\\\\\\\\\\\\\\\\\\\\\\
router.get(
  '/',
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
router.post(
  '/',
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
router.put(
  '/:id',
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
router.delete(
  '/:id',
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
router.post(
  '/add-to-tournament',
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
router.post(
  '/assign-captain',
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









export default router;