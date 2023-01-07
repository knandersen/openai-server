require('dotenv').config()
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const local = process.env.LOCAL || false;

// CORS

app.use(cors())
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://knandersen.github.io/',
    'https://www.kevinandersen.dk',
    'https://kevinandersen.dk',
    local
  ]
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
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
  model: "text-davinci-003",
  prompt: "",
  temperature: 0.6,
  max_tokens: 35,
}

// Endpoints

app.get("/connect", (req, res) => {
  res.type('text').send(`connected`)
});


app.get("/completion", async (req, res) => {
  const prompt = req.query.prompt;
  let input = completionTemplate;
  input.prompt = prompt;
  const response = await openai.createCompletion(input).catch(err => console.log(err));
  if (response.data) {
    res.type('text').send(response.data.choices[0].text);
  } else {
    res.send(503).send("Service unavailable")
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));