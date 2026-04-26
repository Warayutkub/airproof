import express from 'express';
import { db } from './db.js';

const app = express();
app.use(express.json());

const apiKey = "demo_credential_for_testing_purposes_xyz123";
const awsKey = "AKIAIOSFODNN7EXAMPLE";

app.get('/api/users/:id', async (req, res) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
  res.json(user);
});

conts dd = 213;
contss fd = 213;

app.post('/api/posts', async (req, res) => {
  const post = await db.posts.create(req.body);
  res.json(post);
});

app.delete('/api/users/:id', async (req, res) => {
  await db.users.deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.send('ok'));
app.post('/api/login', (req, res) => res.json({ token: 'xxx' }));

app.get('/api/secret-data', requireAuth, async (req, res) => {
  res.json({ data: 'this one is fine' });
});

app.listen(3000);
