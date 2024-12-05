const pool = require('../config/db');

const UserModel = {
    createUser: async (username, hashedPassword) => {
        return pool.query(
            'INSERT INTO progress (username, password, page_number) VALUES ($1, $2, 0)',
            [username, hashedPassword]
        );
    },
    findUserByUsername: async (username) => {
        const result = await pool.query('SELECT * FROM progress WHERE username = $1', [username]);
        return result.rows[0];
    },
    updateUserProgress: async (username, page_number) => {
        return pool.query(
            'UPDATE progress SET page_number = $2 WHERE username = $1 RETURNING *',
            [username, page_number]
        );
    },
    fetchAllProgress: async () => {
        const result = await pool.query('SELECT username, page_number FROM progress ORDER BY page_number DESC');
        return result.rows;
    },
    updateUserProfile: async (username, bio, height, weight, profile_picture) => {
        return pool.query(
            'UPDATE progress SET bio = $2, height = $3, weight = $4, profile_picture = $5 \
            WHERE username = $1 RETURNING *',
            [username, bio, height, weight, profile_picture]
        );
    }
};

module.exports = UserModel;
