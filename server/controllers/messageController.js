const MessageModel = require('../models/messageModel');

const messageController = {
  sendMessage: async (req, res) => {
      const { username, message, image_link } = req.body;
      try {
          const result = await MessageModel.postMessage(username, message, image_link);
          if (!result) return res.status(404).send('no messages found');
          res.json(result);
      } catch (error) {
          console.error('Error updating progress:', error);
          res.status(500).send('Error updating progress');
      }
  },
  fetchMessages: async (req, res) => {
      try {
          const messages = await MessageModel.getAllMessages();
          res.json(messages);
      } catch (error) {
          console.error('Error fetching messages:', error);
          res.status(500).send('Error fetching messages');
      }
  },
};

module.exports = messageController;