import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import passport from '../../config/passport.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import logger from 'morgan'
import jwt from 'jsonwebtoken';
import cors from 'cors';  // Import cors
import { query } from './db.js';





export const checkAdmin = (req, res, next) => {
  console.log('checkAdmin middleware called');
  console.log('User from request:', req.user);
  
  // Make sure user exists in the request
  if (!req.user || !req.user.id) {
    console.log('No user in request or missing ID');
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const userId = req.user.id;
  console.log('Checking admin status for user ID:', userId);
  
  // Check if user is already admin in the token
  if (req.user.role === 'admin') {
    console.log('User is admin according to JWT token');
    return next();
  }
  
  // Fallback to database check
  query('SELECT user_type FROM users WHERE id = $1', [userId])
    .then(result => {
      console.log('Database query result:', result.rows);
      
      if (result.rows.length > 0 && result.rows[0].user_type === 'admin') {
        console.log('User is admin according to database');
        next();
      } else {
        console.log('User is NOT admin:', result.rows);
        res.status(403).json({ message: 'Access denied' });
      }
    })
    .catch(err => {
      console.error('Database error when checking admin:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
};