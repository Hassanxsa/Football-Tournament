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
    try {
      // 1. Active tournaments
      const activeTournamentsQ = `
        SELECT
          tr_id   AS id,
          tr_name AS name,
          start_date,
          end_date
        FROM public.tournament AS t
        WHERE t.status = 'active'
        ORDER BY start_date;
      `;

      // 3. Ten most recent matches
      const recentMatchesQ = `
        SELECT
          m.match_no,
          m.play_date,
          t1.team_name AS team1,
          t2.team_name AS team2,
          v.venue_name AS venue,
          m.results
        FROM public.match_played AS m
        JOIN public.team   AS t1 ON m.team_id1 = t1.team_id
        JOIN public.team   AS t2 ON m.team_id2 = t2.team_id
        JOIN public.venue  AS v  ON m.venue_id  = v.venue_id
        ORDER BY m.play_date DESC
        LIMIT 10;
      `;

      // 4. Participating teams in active tournaments (up to 10)
      const participatingTeamsQ = `
        SELECT DISTINCT
          t.team_id,
          t.team_name
        FROM public.team            AS t
        
        
        WHERE t.status = 'active'
        ORDER BY t.team_name
        LIMIT 10;
      `;

      const [
        { rows: activeTournaments },
        { rows: recentMatches },
        { rows: participatingTeams }
      ] = await Promise.all([
        query(activeTournamentsQ),
        query(recentMatchesQ),
        query(participatingTeamsQ)
      ]);

      return res.json({
        activeTournaments,
        tournamentStandings: [],      // TODO: implement standings query
        recentMatches,
        participatingTeams
      });
    } catch (err) {
      console.error('Error fetching home data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);














export default router;
