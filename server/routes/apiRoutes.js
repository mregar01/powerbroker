const express = require('express');
const AuthController = require('../controllers/authController');
const ProgressController = require('../controllers/progressController');
const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');
const VoteController = require('../controllers/voteController');
const QuoteController = require('../controllers/quoteController')
const MosesController = require('../controllers/mosesController')
// import mosesController from "../controllers/mosesController.js";

const router = express.Router();

// Test route
router.get('/', (req, res) => res.send('Backend is working!'));

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Progress routes
router.post('/progress', ProgressController.updateProgress);
router.get('/progress', ProgressController.fetchAllProgress);

// User routes
router.post('/user', UserController.updateUser);
router.get('/user', UserController.fetchUser); 

// Message routes
router.post('/message', MessageController.sendMessage);
router.get('/message', MessageController.fetchMessages);

// Voting route
router.post('/vote', VoteController.createVote);
router.get('/vote', VoteController.fetchVotes);

// Quote ruotes
router.post('/quote', QuoteController.createQuote);
router.get('/quote', QuoteController.getQuotes);


//MosesGPT route
router.post('/bot', MosesController.sendMessage);


module.exports = router;
