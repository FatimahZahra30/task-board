import express from 'express';
import cors from 'cors';
import taskRouter from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Task Board API is running' });
});

app.use('/tasks', taskRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});