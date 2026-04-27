import express from 'express';
const app = express();

// Open redirect
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

app.get('/login-redirect', (req, res) => {
  window.location.href = req.body.next;
});

// Prototype pollution
app.post('/profile', (req, res) => {
  const merged = Object.assign({}, req.body);
  saveUser(merged);
});

app.put('/settings', (req, res) => {
  _.merge(currentSettings, req.body);
});

// Insecure cookie
app.post('/login-cookie', (req, res) => {
  res.cookie('session', 'abc123');
});

app.post('/login-cookie-2', (req, res) => {
  res.cookie('session', 'abc123', {
    maxAge: 3600000,
    secure: true,
  });
});

// TODO security comments
// TODO: fix this hardcoded password before production
const password = 'admin123';

// FIXME: SECURITY - bypass auth check for now
function checkAuth(user) {
  return true;
}

// HACK: insecure direct request — fix later
const data = fetch('/api/admin');
