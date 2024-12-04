require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { Pool } = require('pg');

const app = express();
const PORT = 5001;

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:3000', // Local frontend
        'https://powerbroker.vercel.app' // Deployed frontend
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Connect to PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render
    }
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Test route
app.get('/api', (req, res) => {
    res.send('Backend is working!');
});

// Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await pool.query(
      'INSERT INTO progress (username, password, page_number) VALUES ($1, $2, 0)',
      [username, hashedPassword]
    );

    // Generate a JWT
    const token = jwt.sign(
      { username }, // Use the username from the request body
      process.env.JWT_SECRET, // Secret or Private Key
      { expiresIn: '1h' } // Options (e.g., expiration time)
    );

    res.status(201).json({ username, token }); // Proper JSON response
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error during registration'); // Send an appropriate error message
  }
});


// Login a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user in the database
        const userResult = await pool.query('SELECT * FROM progress WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = userResult.rows[0];

        // Compare the hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(403).send('Invalid credentials');
        }

        // Generate a JWT
        const token = jwt.sign({ username }, process.env.SECRET_KEY || 'defaultSecret', { expiresIn: '1h' });
        res.status(200).json({ token, page_number: user.page_number });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

// Update user progress
app.post('/api/progress', async (req, res) => {
    const { username, page_number } = req.body;
    try {
        const result = await pool.query(
            'UPDATE progress SET page_number = $2 WHERE username = $1 RETURNING *',
            [username, page_number]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).send('Error updating progress');
    }
});

// Fetch all user progress
app.get('/api/progress', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, page_number FROM progress ORDER BY page_number DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).send('Error fetching progress');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
