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


// Function to update league standings for a tournament
export async function updateLeagueStandings(tournamentId) {
  try {
    // Get all teams in this tournament
    const teamsResult = await query(
      'SELECT team_id FROM tournament_team WHERE tr_id = $1',
      [tournamentId]
    );

    // For each team, calculate their statistics
    for (const team of teamsResult.rows) {
      const teamId = team.team_id;
      
      // Get all matches for this team in this tournament
      const matchesResult = await query(
        `SELECT * FROM match_played 
         WHERE tr_id = $1 AND (team_id1 = $2 OR team_id2 = $2) 
         AND goal_score IS NOT NULL AND goal_score != '0-0' AND goal_score != 'N/A'`,
        [tournamentId, teamId]
      );
      
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      
      // Calculate statistics based on matches
      matchesResult.rows.forEach(match => {
        played++;
        
        // Parse goal score (format: '2-1')
        const scores = match.goal_score.split('-');
        const score1 = parseInt(scores[0]);
        const score2 = parseInt(scores[1]);
        
        // Determine if this team is team1 or team2
        if (match.team_id1 === teamId) {
          // This team is team1
          goalsFor += score1;
          goalsAgainst += score2;
          
          if (score1 > score2) won++;
          else if (score1 < score2) lost++;
          else drawn++;
        } else {
          // This team is team2
          goalsFor += score2;
          goalsAgainst += score1;
          
          if (score2 > score1) won++;
          else if (score2 < score1) lost++;
          else drawn++;
        }
      });
      
      // Calculate points (3 for win, 1 for draw)
      const points = (won * 3) + drawn;
      const goalDifference = goalsFor - goalsAgainst;
      
      // Check if standing exists for this team and tournament
      const standingExists = await query(
        'SELECT * FROM league_standings WHERE tr_id = $1 AND team_id = $2',
        [tournamentId, teamId]
      );
      
      if (standingExists.rows.length > 0) {
        // Update existing standing
        await query(
          `UPDATE league_standings 
           SET played = $1, won = $2, drawn = $3, lost = $4, 
               goals_for = $5, goals_against = $6, goal_difference = $7, points = $8 
           WHERE tr_id = $9 AND team_id = $10`,
          [played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points, tournamentId, teamId]
        );
      } else {
        // Insert new standing
        await query(
          `INSERT INTO league_standings 
           (tr_id, team_id, played, won, drawn, lost, goals_for, goals_against, goal_difference, points) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [tournamentId, teamId, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points]
        );
      }
    }
    
    // Update positions based on points and goal difference
    await query(
      `WITH ranked_standings AS (
         SELECT 
           standing_id, 
           ROW_NUMBER() OVER (PARTITION BY tr_id ORDER BY points DESC, goal_difference DESC, goals_for DESC) as new_position 
         FROM league_standings 
         WHERE tr_id = $1
       )
       UPDATE league_standings ls 
       SET position = rs.new_position 
       FROM ranked_standings rs 
       WHERE ls.standing_id = rs.standing_id`,
      [tournamentId]
    );
    
    console.log(`Updated league standings for tournament ${tournamentId}`);
    return true;
  } catch (err) {
    console.error('Error updating league standings:', err);
    return false;
  }
}