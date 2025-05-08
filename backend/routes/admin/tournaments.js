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

/////////////////////// tournament routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get(
  '/',
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
router.post(
  '/',
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
router.put(
  '/:id',
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
router.delete(
  '/:id',
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

// Create a new match for a tournament
router.post('/:trId/matches', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
  const { trId } = req.params;
  const { play_date, team_id1, team_id2, play_stage, venue_id, results, decided_by, goal_score, audience, player_of_match, stop1_sec, stop2_sec } = req.body;

  try {
    const tournamentExists = await query('SELECT * FROM tournament WHERE tr_id = $1', [trId]);
    if (tournamentExists.rows.length === 0) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check that both teams exist in the tournament
    const team1Check = await query('SELECT * FROM tournament_team WHERE tr_id = $1 AND team_id = $2', [trId, team_id1]);
    const team2Check = await query('SELECT * FROM tournament_team WHERE tr_id = $1 AND team_id = $2', [trId, team_id2]);

    if (team1Check.rows.length === 0 || team2Check.rows.length === 0) {
      return res.status(400).json({ message: 'One or both teams are not participating in this tournament' });
    }

    // Get the next match_no
    const maxMatchNoResult = await query('SELECT MAX(match_no) FROM match_played');
    const maxMatchNo = maxMatchNoResult.rows[0].max || 0;
    const newMatchNo = maxMatchNo + 1;

    // First get valid player_id values from the database
    const playerQuery = await query('SELECT player_id FROM player LIMIT 1');
    let validPlayerId = null;
    
    if (playerQuery.rows.length > 0) {
      validPlayerId = playerQuery.rows[0].player_id;
    }
    
    // Insert the new match
    let newMatch;
    
    if (validPlayerId) {
      // If we have a valid player, use it for player_of_match
      newMatch = await query(
        'INSERT INTO match_played (match_no, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, player_of_match, stop1_sec, stop2_sec) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [newMatchNo, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, validPlayerId, stop1_sec || 0, stop2_sec || 0]
      );
    } else {
      // If we couldn't find a valid player, attempt an insert without the player_of_match field
      // This requires your DB schema to allow NULL for this field, or for it to have a DEFAULT value set
      newMatch = await query(
        'INSERT INTO match_played (match_no, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, stop1_sec, stop2_sec) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [newMatchNo, play_date, team_id1, team_id2, venue_id, results, decided_by, goal_score, audience, stop1_sec || 0, stop2_sec || 0]
      );
    }

    // If match has a score (not a future match), update league standings
    if (goal_score && goal_score !== '0-0' && goal_score !== 'N/A') {
      await updateLeagueStandings(trId);
    }

    res.status(201).json(newMatch.rows[0]);
  } catch (err) {
    console.error('Error creating match:', err);
    res.status(500).json({ message: 'Failed to create match', error: err.message });
  }
});

// Endpoint to manually trigger standings recalculation
router.post('/:trId/recalculate-standings', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
  const { trId } = req.params;
  
  try {
    const success = await updateLeagueStandings(trId);
    if (success) {
      res.json({ message: 'Standings recalculated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to recalculate standings' });
    }
  } catch (err) {
    console.error('Error recalculating standings:', err);
    res.status(500).json({ message: 'Failed to recalculate standings', error: err.message });
  }
});


// Endpoint to manually trigger standings recalculation
router.post('/:trId/recalculate-standings', passport.authenticate('jwt', { session: false }), checkAdmin, async (req, res) => {
    const { trId } = req.params;
    
    try {
      const success = await updateLeagueStandings(trId);
      if (success) {
        res.json({ message: 'Standings recalculated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to recalculate standings' });
      }
    } catch (err) {
      console.error('Error recalculating standings:', err);
      res.status(500).json({ message: 'Failed to recalculate standings', error: err.message });
    }
  });


export default router;