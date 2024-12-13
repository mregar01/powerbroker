const OpenAI = require("openai");
const fs = require("fs").promises;

const client = new OpenAI(
  {apiKey: process.env.OPENAI_API_KEY}
);

const mosesController = {
  sendMessage: async (req, res) => {
      const { message } = req.body;
      const filePath = `${__dirname}/moses.txt`;
      // console.log("Resolved file path:", filePath); // Debugging

      const fileContent = await fs.readFile(filePath, "utf-8");

      if (!message) {
          return res.status(400).send('Message field is required');
      }

      try {
          const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                  { role: "system", content: fileContent },
                  { role: "user", content: message },
              ],
          });

          const responseMessage = completion.choices[0].message.content;

          res.json({responseMessage})
      } catch (error) {
          console.error('Error communicating with OpenAI API:', error);
          res.status(500).send('Error communicating with OpenAI API');
      }
  },
  fetchMessages: async (req, res) => {
      try {
          // Stub for fetching messages (if needed in the future)
          res.json({ message: "fetchMessages functionality is not implemented yet" });
      } catch (error) {
          console.error('Error fetching messages:', error);
          res.status(500).send('Error fetching messages');
      }
  },
};

module.exports = mosesController;
