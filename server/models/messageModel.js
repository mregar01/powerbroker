const pool = require('../config/db');

const MessageModel = {
  // Get all messages
  getAllMessages: async () => {
    try {
      const result = await pool.query('SELECT * FROM Messages ORDER BY created_at DESC;');
      return result.rows;
    } catch (err) {
      console.error('Error fetching messages:', err);
      throw err;
    }
  },
  // Post a new message
  postMessage: async (username, message, image_link) => {
    try {
      const result = await pool.query(
        'INSERT INTO Messages (username, message, image_link) VALUES ($1, $2, $3) RETURNING *;',
        [username, message, image_link]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error posting message:', err);
      throw err;
    }
  }
}

module.exports = MessageModel;