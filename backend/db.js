require("dotenv").config();
const {Client} = require("pg");

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
      }
});

client.connect().then(() =>
     console.log("Connected to PostegreSQL"))
     .catch(err => console.error("Connection error:", err));;
