const pool = require('../config/db');

const QuoteModel = {
  // add a quote to a user
  addQuote: async (username, quote, page_number, author) => {
    try {
      const result = await pool.query(`
        INSERT INTO quotes (username, quote, page_number, author)
        VALUES ($1, $2, $3, $4) RETURNING *;`, [username, quote, page_number, author]);
            return result.rows[0]; // Return the first row of the result
    } catch (err) {
      console.error('Error adding quote:', err);
      throw err;
    }
  },
  // get user quotes
  getAllQuotes: async (username) => {
    try {
      const result = await pool.query(
        `
        SELECT *
          FROM quotes
          WHERE username = $1;
        `,
        [username]
      );
      return result.rows;
    } catch (err) {
        console.error('Error getting quotes:', err);
        throw err; // Rethrow the error to be caught in the controller
    }
  },
  editQuote: async (id, newQuote, newPage, newAuthor) => {
    try {
      const edited = await pool.query(
        `
        UPDATE quotes
        SET quote = $1, page_number = $2, author = $3
        WHERE id = $4
        RETURNING *;
        `,
        [newQuote, newPage, newAuthor, id]
      );
      return edited.rows[0]; // Return the updated quote
    } catch (err) {
      console.error('Error editing quote:', err);
      throw err; // Rethrow the error to be caught in the controller
    }
  },
  deleteQuote: async (id) => {
    try {
      const result = await pool.query(
        `
        DELETE FROM quotes
        WHERE id = $1
        RETURNING *;
        `,
        [id]
      );
      return result.rows[0]; // Return the deleted quote (or null if not found)
    } catch (err) {
      console.error('Error deleting quote:', err);
      throw err; // Rethrow the error to be caught in the controller
    }
  }  
  
}

module.exports = QuoteModel;