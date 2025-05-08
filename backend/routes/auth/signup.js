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





const router = express.Router();

router.post('/', async (req, res) => {
  const {first_name, last_name, email, password, date_of_birth} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Extract KFUPM ID from email (e.g., "s202272000@kfupm.edu.sa")
  const match = email.match(/^s(\d{9})@kfupm\.edu\.sa$/);
  if (!match) {
    return res.status(400).json({ message: 'Invalid KFUPM email format' });
  }
  const kfupmId = parseInt(match[1]); // This will be 202272000


  try {
    await query(
      'INSERT INTO users (id, first_name, last_name, email, password, user_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [kfupmId, first_name, last_name, email, hashedPassword, 'guest']
    );
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });

  }
}
);

export default router;