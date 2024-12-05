const express = require('express');
const AuthController = require('../controllers/authController');
const ProgressController = require('../controllers/progressController');

const router = express.Router();

// Test route
router.get('/', (req, res) => res.send('Backend is working!'));

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Progress routes
router.post('/progress', ProgressController.updateProgress);
router.get('/progress', ProgressController.fetchAllProgress);

module.exports = router;
