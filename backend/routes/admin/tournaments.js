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


export default router;