import express from 'express';
import { exec } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { db } from './db.js';

const app = express();

// XSS
function renderName(name) {
  document.getElementById('greeting').innerHTML = `Hello ${name}`;
}
const Component = () => <div dangerouslySetInnerHTML={{ __html: userInput }} />;
const result = eval(userCode);

// Command injection
app.get('/run', (req, res) => {
  exec(`ls ${req.query.dir}`, (err, stdout) => res.send(stdout));
});

// CORS allow all
app.use(cors());

// Weak crypto
const hash = crypto.createHash('md5').update(password).digest('hex');
const fingerprint = crypto.createHash('sha1').update(data).digest('hex');

// HTTP not HTTPS
const data = await fetch('http://api.example.com/users');
await axios.get('http://payments.example.com/process');

// Exposed errors
app.get('/api/data', async (req, res) => {
  try {
    const data = await db.query('SELECT * FROM data');
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Path traversal
app.get('/file', async (req, res) => {
  const content = await readFile(path.join('./uploads', req.query.name));
  res.send(content);
});

// Mass assignment
app.put('/api/profile/:id', async (req, res) => {
  await db.users.updateOne({ id: req.params.id }, { ...req.body });
  res.json({ ok: true });
});

// JWT issues
const token = jwt.sign({ userId: 1 }, 'secret123');
const decoded = jwt.decode(req.headers.authorization);

// No rate limit on login
app.post('/api/login', async (req, res) => {
  const user = await db.users.findOne({ email: req.body.email });
  res.json({ token: 'xxx' });
});

app.post('/api/register', async (req, res) => {
  const user = await db.users.create({ email: req.body.email });
  res.json({ ok: true });
});
