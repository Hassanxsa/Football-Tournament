// server.js
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import passport from './config/passport.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import logger from 'morgan'
import jwt from 'jsonwebtoken';
import cors from 'cors';  // Import cors
import { query } from './db/connectPostgres.js';
import axios from 'axios';
const PORT = process.env.PORT || 5000;


const app = express();
app.use(logger('dev')) // Log requests to the console
app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// signup route

app.post('/signup', async (req, res) => {
  const {first_name, last_name, email, password} = req.body;
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

// login route

app.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    });
  })(req, res);
});

// welcome test route
app.get('/', (req, res) => {
  res.send('Welcome to the Football Tournament API!');
});











































// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});