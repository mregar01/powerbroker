const express = require('express');
const bodyParser = require('body-parser'); // Add for parsing JSON bodies
const app = express();
const PORT = 5001;

const cors = require('cors');

// Allow requests from localhost:3000
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend-url.vercel.app']
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
app.get('/api/progress', (req, res) => {
  res.json(progress);
});

// Helper function to capitalize the first letter
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Update progress
app.post('/api/progress', (req, res) => {
  const { user, page } = req.body;

  // Normalize the user's name
  const normalizedUser = capitalize(user);

  // Check if the user already exists (case-insensitive)
  const existingUser = progress.find((p) => p.user.toLowerCase() === normalizedUser.toLowerCase());

  if (existingUser) {
    existingUser.page = page; // Update progress
  } else {
    progress.push({ user: normalizedUser, page }); // Add new user
  }

  res.json({ message: 'Progress updated!', progress });
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
