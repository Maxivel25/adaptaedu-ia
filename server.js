const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const resposta = completion.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar o modelo' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
