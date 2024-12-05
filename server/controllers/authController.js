const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {
    register: async (req, res) => {
        const { username, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.createUser(username, hashedPassword);
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ username, token });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Error during registration');
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await UserModel.findUserByUsername(username);
            if (!user) return res.status(404).send('User not found');

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return res.status(403).send('Invalid credentials');

            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token, page_number: user.page_number });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Server error');
        }
    },
};

module.exports = AuthController;
