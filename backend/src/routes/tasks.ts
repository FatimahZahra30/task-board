import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

const validStatuses = ['todo', 'in_progress', 'done'];

function validateTask(title: unknown, status: unknown) {
  if (typeof title !== 'string' || title.trim() === '') {
    return 'Title is required';
  }

  if (title.length > 100) {
    return 'Title must be 100 characters or less';
  }

  if (!validStatuses.includes(status as string)) {
    return 'Status must be todo, in_progress, or done';
  }

  return null;
}

router.get('/', (_req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();

  res.json(tasks);
});

router.post('/', (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const validationError = validateTask(title, status);

    if (validationError) {
    res.status(400).json({ error: validationError });
    return;
    }

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

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);

  const existingTask = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(id) as {
      id: number;
      title: string;
      description: string | null;
      status: string;
      due_date: string | null;
      created_at: string;
    } | undefined;

  if (!existingTask) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const {
    title = existingTask.title,
    description = existingTask.description,
    status = existingTask.status,
    dueDate = existingTask.due_date
  } = req.body;

  const validationError = validateTask(title, status);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  db.prepare(`
    UPDATE tasks
    SET title = ?,
        description = ?,
        status = ?,
        due_date = ?
    WHERE id = ?
  `).run(
    title,
    description ?? null,
    status,
    dueDate ?? null,
    id
  );

  const updatedTask = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(id);

  res.json(updatedTask);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  const existingTask = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(id);

  if (!existingTask) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  res.status(204).send();
});

export default router;