import { db } from '../db.js';

export function setupAdminRoutes(app) {
  app.get('/admin/users', async (req, res) => {
    const users = await db.query(`SELECT * FROM users ORDER BY ${req.query.sort}`);
    res.json(users);
  });

  app.delete('/admin/users/:id', async (req, res) => {
    await db.users.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  });
}
