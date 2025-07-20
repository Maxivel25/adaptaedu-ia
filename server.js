const express = require('express');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error('Erro: OPENAI_API_KEY não definida no .env');
  process.exit(1); // Encerra o servidor se não houver chave
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error('Erro ao consultar o modelo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao consultar o modelo da OpenAI.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
});
