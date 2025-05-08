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
    const { search, status } = req.query;
    const conditions = [];
    const values     = [];

    // Filter by name substring
    if (search) {
      conditions.push(`v.venue_name ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
    }
    // Filter by status code
    if (status) {
      conditions.push(`v.venue_status = $${values.length + 1}`);
      values.push(status);
    }

    const sql = `
      SELECT
        v.venue_id,
        v.venue_name,
        v.venue_status,
        v.venue_capacity,
        COALESCE(mp.num_matches, 0) AS num_matches
      FROM public.venue AS v

      /* Count how many matches each venue has hosted */
      LEFT JOIN (
        SELECT
          venue_id,
          COUNT(*) AS num_matches
        FROM public.match_played
        GROUP BY venue_id
      ) AS mp
        ON mp.venue_id = v.venue_id

      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}

      ORDER BY v.venue_name;
    `;

    try {
      const { rows } = await query(sql, values);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching venues:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);









export default router;