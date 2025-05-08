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
////////////////////// User management routes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Get all users (admin only)
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkAdmin,
    async (req, res) => {
      const sql = `
        SELECT id, first_name, last_name, email, user_type
        FROM public.users;
      `;
  
      try {
        const { rows } = await query(sql);
        return res.json(rows);
      } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  );
  // Update user type (admin only)
  router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkAdmin,
    async (req, res) => {
      const { id } = req.params;
      const { user_type } = req.body;
      const sql = `
        UPDATE public.users
        SET user_type = $1
        WHERE id = $2;
      `;
  
      try {
        await query(sql, [user_type, id]);
        return res.json({ message: 'User type updated successfully' });
      } catch (err) {
        console.error('Error updating user type:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  );
  // Delete a user (admin only)
  router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkAdmin,
    async (req, res) => {
      const { id } = req.params;
      const sql = `
        DELETE FROM public.users
        WHERE id = $1;
      `;
  
      try {
        await query(sql, [id]);
        return res.json({ message: 'User deleted successfully' });
      } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  );

export default router