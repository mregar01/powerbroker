const UserModel = require('../models/userModel');

const ProgressController = {
    updateProgress: async (req, res) => {
        const { username, page_number } = req.body;
        try {
            const result = await UserModel.updateUserProgress(username, page_number);
            if (!result.rows.length) return res.status(404).send('User not found');
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating progress:', error);
            res.status(500).send('Error updating progress');
        }
    },
    fetchAllProgress: async (req, res) => {
        try {
            const progress = await UserModel.fetchAllProgress();
            res.json(progress);
        } catch (error) {
            console.error('Error fetching progress:', error);
            res.status(500).send('Error fetching progress');
        }
    },
};

module.exports = ProgressController;
