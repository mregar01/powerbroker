const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://powerbroker.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

module.exports = app;
