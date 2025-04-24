import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;


const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    }
})

client.connect()

export const query = async (text, params) => {
    try {
        console.log('Executing query:', text, params);
        const res = await client.query(text, params);
        return res;
    }
    catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

/* 
HOW TO USE
 query(qs).then(data => {res.json(data.rows)})
*/

