const pool = require('../config/db');

const QuoteModel = {
  // add a quote to a user
  addQuote: async (username, quote) => {
    try {
      const result = await pool.query(`
        UPDATE progress
            SET quotes = quotes || ARRAY[$1]
            WHERE username = $2 RETURNING *;`, [quote, username]);
            return result.rows[0]; // Return the first row of the result
    } catch (err) {
      console.error('Error adding quote:', err);
      throw err;
    }
  },
  // get user quotes
  getAllQuotes: async (username) => {
    try {
      const { rows } = await pool.query(
        `
        SELECT quotes
            FROM progress 
            WHERE username = $1;
        `,
        [username]
      );
      return rows[0].quotes; // Directly return the array of quotes
    } catch (err) {
        console.error('Error getting quotes:', err);
        throw err; // Rethrow the error to be caught in the controller
    }
  }
}

module.exports = QuoteModel;