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

export default app;