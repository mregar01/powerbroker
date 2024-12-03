const express = require('express');
const bodyParser = require('body-parser'); // Add for parsing JSON bodies
const app = express();
const PORT = 5001;

const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render
    }
});



// Allow requests from the frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://powerbroker.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware for JSON parsing
app.use(bodyParser.json());

// Mock database
let progress = [
  
];

// API Route: Test route
app.get('/api', (req, res) => {
  res.send('Backend is working!');
});

// API Route: Get all progress
app.get('/api/progress', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM progress ORDER BY page DESC');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).send('Error fetching progress');
  }
});


// Helper function to capitalize the first letter
// function capitalize(name) {
//   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
// }

// Update progress
app.post('/api/progress', async (req, res) => {
  const { user, page } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO progress ("user", page) VALUES ($1, $2) ON CONFLICT ("user") DO UPDATE SET page = $2 RETURNING *',
      [user, page]
  );
  
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).send('Error updating progress');
  }
});


// Serve React build files in production
// if (process.env.NODE_ENV === 'production') {
//   const path = require('path');
//   app.use(express.static(path.join(__dirname, '../client/build')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
//   });
// }

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
