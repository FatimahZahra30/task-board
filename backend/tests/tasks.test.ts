import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Task API', () => {
  it('GET /tasks returns a list of tasks', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /tasks creates a new task', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({
        title: 'Test task',
        description: 'A task created by the test',
        status: 'todo',
        dueDate: '2026-10-05'
        });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test task');
    expect(response.body.status).toBe('todo');
    });

    it('POST /tasks rejects an empty title', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
            title: '',
            status: 'todo'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Title is required');
        });
    
    it('POST /tasks rejects an invalid status', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
            title: 'Test task',
            status: 'banana'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            'Status must be todo, in_progress, or done'
        );
        });
    
    it('PATCH /tasks/:id updates an existing task', async () => {
        const response = await request(app)
            .patch('/tasks/1')
            .send({
            status: 'done'
            });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('done');
        });

    it('PATCH /tasks/:id returns 404 for a missing task', async () => {
        const response = await request(app)
            .patch('/tasks/999')
            .send({
            status: 'done'
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
        });
    
    it('DELETE /tasks/:id deletes an existing task', async () => {
        const createResponse = await request(app)
            .post('/tasks')
            .send({
            title: 'Task to delete',
            status: 'todo'
            });

        const taskId = createResponse.body.id;

        const deleteResponse = await request(app)
            .delete(`/tasks/${taskId}`);

        expect(deleteResponse.status).toBe(204);
        });
    
    it('DELETE /tasks/:id returns 404 for a missing task', async () => {
        const response = await request(app)
            .delete('/tasks/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
        });
});