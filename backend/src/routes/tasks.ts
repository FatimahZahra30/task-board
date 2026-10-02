import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();

  res.json(tasks);
});

router.post('/', (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const createdAt = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO tasks (title, description, status, due_date, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    title,
    description ?? null,
    status,
    dueDate ?? null,
    createdAt
  );

  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(task);
});

export default router;