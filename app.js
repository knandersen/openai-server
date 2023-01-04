require('dotenv').config()
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

// CORS

app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

// OpenAI config

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

const completionTemplate = {
  model: "text-davinci-002",
  prompt: "",
  temperature: 0.6,
  max_tokens: 35,
}

// Endpoints

app.get("/connect", (req, res) => res.type('html').send(`<p>Connection established!</p>`));

app.get("/completion", async (req, res) => {
  const prompt = req.query.prompt;
  let input = completionTemplate;
  input.prompt = prompt;
  const response = await openai.createCompletion(input);
  res.type('json').send(response.data.choices[0].text);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));