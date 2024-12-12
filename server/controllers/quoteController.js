const QuoteModel = require('../models/quoteModel');

const QuoteController = {
  createQuote: async (req, res) => {
    const { username, quote } = req.body; // Extract from query parameters
    try {
      const quote1 = await QuoteModel.addQuote(username, quote);
      if (!quote1) return res.status(404).send('couldnt quote');
      res.json(quote);
      // Return the vote count directly as a simple JSON object
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).send('Error adding quote');
    }
  },
  getQuotes: async (req, res) => {
      const { username } = req.query; // Use query parameters instead of the body
      try {
          const quotes = await QuoteModel.getAllQuotes(username);
          if (!quotes) return res.status(404).send('couldnt vote');
          res.json({ quotes });
      } catch (error) {
          console.error('Error getting quotes:', error);
          res.status(500).send('Error getting quotes');
      }
  }
};

module.exports = QuoteController;
