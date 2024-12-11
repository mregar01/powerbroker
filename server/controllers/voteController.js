const VoteModel = require('../models/voteModel');

const VoteController = {
  fetchVotes: async (req, res) => {
    const { message_id } = req.query; // Extract from query parameters

    if (!message_id) {
        return res.status(400).send('Message ID is required');
    }

    try {
      const voteCount = await VoteModel.getMessageVotes(message_id);

      // Return the vote count directly as a simple JSON object
      res.json({ vote_count: voteCount });
    } catch (error) {
        console.error('Error getting votes:', error);
        res.status(500).send('Error getting votes');
    }
  },
    createVote: async (req, res) => {
        const { message_id, username, vote_type } = req.body; // Use query parameters instead of the body
        try {
            const vote = await VoteModel.voteOnMessage(message_id, username, vote_type)
            if (!vote) return res.status(404).send('couldnt vote');
            res.json(vote);
        } catch (error) {
            console.error('Error voting:', error);
            res.status(500).send('Error voting');
        }
    }
};

module.exports = VoteController;
