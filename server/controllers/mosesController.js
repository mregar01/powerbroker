// const OpenAI = require("openai");
// const fs = require("fs").promises;

// const client = new OpenAI(
//   {apiKey: process.env.OPENAI_API_KEY}
// );

// const mosesController = {
//   sendMessage: async (req, res) => {
//       const { message } = req.body;
//       const filePath = `${__dirname}/moses.txt`;
//       // console.log("Resolved file path:", filePath); // Debugging

//       const fileContent = await fs.readFile(filePath, "utf-8");

//       if (!message) {
//           return res.status(400).send('Message field is required');
//       }

//       try {
//           const completion = await client.chat.completions.create({
//               model: "gpt-4o-mini",
//               messages: [
//                   { role: "system", content: fileContent },
//                   { role: "user", content: message },
//               ],
//           });

//           const responseMessage = completion.choices[0].message.content;

//           res.json({responseMessage})
//       } catch (error) {
//           console.error('Error communicating with OpenAI API:', error);
//           res.status(500).send('Error communicating with OpenAI API');
//       }
//   }
// };

// module.exports = mosesController;


const OpenAI = require("openai");
const fs = require("fs").promises;
const { exec } = require("child_process");
const path = require("path");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mosesController = {
  sendMessage: async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).send("Message field is required");
    }

    // Path to the Python script
    const scriptPath = path.join(__dirname, "../scripts/get_instructions.py");

    try {
      // Run the Python script
      await new Promise((resolve, reject) => {
        exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error("Error executing Python script:", stderr);
            return reject(error);
          }
          resolve(stdout);
        });
      });

      // Path to the generated file
      const filePath = path.join(__dirname, "../moses.txt");

      // Read the content of the generated file
      const fileContent = await fs.readFile(filePath, "utf-8");

      // Call the OpenAI API
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: fileContent },
          { role: "user", content: message },
        ],
      });

      const responseMessage = completion.choices[0].message.content;

      res.json({ responseMessage });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error processing the request");
    }
  },
};

module.exports = mosesController;
