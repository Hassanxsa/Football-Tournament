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


router.post('/', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        message: 'Internal server error during login',
      });
    }
    
    if (!user) {
      return res.status(401).json({
        message: info ? info.message : 'Invalid email or password',
      });
    }
    
    req.login(user, { session: false }, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return res.status(500).json({ message: 'Error during login process' });
      }
      
      // Include user role information in the token payload
      const token = jwt.sign({ 
        id: user.id,
        role: user.user_type || 'user'
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return res.status(200).json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.user_type || 'user'
        }
      });
    });
  })(req, res);
});

export default router;
