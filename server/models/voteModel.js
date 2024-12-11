const pool = require('../config/db');

const VoteModel = {
  // Get all votes on a certain message
  getMessageVotes: async (message_id) => {
    try {
      const result = await pool.query(`
        SELECT 
            SUM(CASE 
                    WHEN vote_type = 'upvote' THEN 1
                    WHEN vote_type = 'downvote' THEN -1
                    ELSE 0 
                END) AS vote_count
        FROM votes
        WHERE message_id = $1;`, [message_id]);
        return result.rows[0]?.vote_count ? parseInt(result.rows[0].vote_count, 10) : 0;
    } catch (err) {
      console.error('Error fetching messages:', err);
      throw err;
    }
  },
  // Vote on a message
  voteOnMessage: async (message_id, username, vote_type) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO votes (message_id, username, vote_type) 
            VALUES ($1, $2, $3)
            ON CONFLICT (message_id, username) 
            DO UPDATE SET vote_type = EXCLUDED.vote_type
            RETURNING *;
            `,
            [message_id, username, vote_type]
        );
        return result.rows[0]; // Return the first row of the result
    } catch (err) {
        console.error('Error voting:', err);
        throw err; // Rethrow the error to be caught in the controller
    }
  }
}

module.exports = VoteModel;