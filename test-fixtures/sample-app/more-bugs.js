import express from 'express';
const app = express();

// SSRF
app.post('/proxy', async (req, res) => {
  const data = await fetch(req.body.url);
  res.json(data);
});

app.get('/scrape', async (req, res) => {
  const html = await axios.get(req.query.target);
  res.send(html);
});

// Insecure deserialization
app.post('/load-plugin', (req, res) => {
  const plugin = require(req.body.module);
  res.json(plugin.run());
});

app.post('/parse', (req, res) => {
  const data = eval(JSON.parse(req.body.payload));
  res.json(data);
});

// Sensitive logging
app.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body.password);
  console.log(`User token: ${req.headers.authorization}`);
  logger.info('API call with apiKey:', config.apiKey);
  res.json({ ok: true });
});
