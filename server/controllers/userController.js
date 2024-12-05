const UserModel = require('../models/userModel');

const UserController = {
    updateUser: async (req, res) => {
        const { username, bio, height, weight, profile_picture } = req.body;
        try {
            const result = await UserModel.updateUserProfile(username, bio, height, weight, profile_picture);
            if (!result.rows.length) return res.status(404).send('User not found');
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Error updating user');
        }
    },
    fetchUser: async (req, res) => {
        const { username } = req.query; // Use query parameters instead of the body
        if (!username) {
            return res.status(400).send('Username is required'); // Handle missing username
        }
        try {
            const user = await UserModel.findUserByUsername(username);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.json(user); // Return the user object
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Error fetching user');
        }
    }
};

module.exports = UserController;
