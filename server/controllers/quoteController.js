// const QuoteModel = require('../models/quoteModel');

// const QuoteController = {
//   createQuote: async (req, res) => {
//     const { username, quote } = req.body; // Extract from query parameters
//     try {
//       const quote1 = await QuoteModel.addQuote(username, quote);
//       if (!quote1) return res.status(404).send('couldnt quote');
//       res.json(quote);
//       // Return the vote count directly as a simple JSON object
//     } catch (error) {
//         console.error('Error adding quote:', error);
//         res.status(500).send('Error adding quote');
//     }
//   },
//   getQuotes: async (req, res) => {
//       const { username } = req.query; // Use query parameters instead of the body
//       try {
//           const quotes = await QuoteModel.getAllQuotes(username);
//           if (!quotes) return res.status(404).send('couldnt vote');
//           res.json({ quotes });
//       } catch (error) {
//           console.error('Error getting quotes:', error);
//           res.status(500).send('Error getting quotes');
//       }
//   }
// };

// module.exports = QuoteController;


const QuoteModel = require('../models/quoteModel');

const QuoteController = {
  createQuote: async (req, res) => {
    const { username, quote, page_number, author } = req.body; // Extract from the body
    try {
      const newQuote = await QuoteModel.addQuote(username, quote, page_number, author);
      if (!newQuote) return res.status(404).send('Could not add quote');
      res.json(newQuote); // Return the new quote as JSON
    } catch (error) {
      console.error('Error adding quote:', error);
      res.status(500).send('Error adding quote');
    }
  },
  getQuotes: async (req, res) => {
    const { username } = req.query; // Use query parameters
    try {
      const quotes = await QuoteModel.getAllQuotes(username);
      if (!quotes || quotes.length === 0) return res.status(404).send('No quotes found');
      res.json({ quotes });
    } catch (error) {
      console.error('Error getting quotes:', error);
      res.status(500).send('Error getting quotes');
    }
  },
  editQuote: async (req, res) => {
    const { quote, page_number, author, id } = req.body; // Extract new values from the body
    try {
      const updatedQuote = await QuoteModel.editQuote(id, quote, page_number, author);
      if (!updatedQuote) return res.status(404).send('Quote not found');
      res.json(updatedQuote); // Return the updated quote as JSON
    } catch (error) {
      console.error('Error editing quote:', error);
      res.status(500).send('Error editing quote');
    }
  },
  deleteQuote: async (req, res) => {
    const { id } = req.body; // Extract ID from route parameters
    try {
      const deletedQuote = await QuoteModel.deleteQuote(id);
      if (!deletedQuote) return res.status(404).send('Quote not found');
      res.json(deletedQuote); // Return the deleted quote as confirmation
    } catch (error) {
      console.error('Error deleting quote:', error);
      res.status(500).send('Error deleting quote');
    }
  }
};

module.exports = QuoteController;
