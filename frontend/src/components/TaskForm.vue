<script setup lang="ts">
import { ref } from 'vue';
import type { TaskStatus } from '../types/task';

const emit = defineEmits<{
  taskCreated: [];
  cancel: [];
}>();

const title = ref('');
const description = ref('');
const status = ref<TaskStatus>('todo');
const dueDate = ref('');

async function createTask() {
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title.value,
      description: description.value || undefined,
      status: status.value,
      dueDate: dueDate.value || undefined
    })
  });

  if (!response.ok) {
    const error = await response.json();
    alert(error.error);
    return;
  }

  emit('taskCreated');

  title.value = '';
  description.value = '';
  status.value = 'todo';
  dueDate.value = '';
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <form class="task-form" @submit.prevent="createTask">
      <div class="form-header">
        <h2>Add Task</h2>

        <button
          type="button"
          class="close-button"
          @click="emit('cancel')"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <label>
        Title
        <input
          v-model="title"
          type="text"
          maxlength="100"
          required
          placeholder="Enter task title"
        />
      </label>

      <label>
        Description
        <textarea
          v-model="description"
          placeholder="Enter description"
        ></textarea>
      </label>

      <label>
        Status
        <select v-model="status">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <label>
        Due date
        <input
          v-model="dueDate"
          type="date"
        />
      </label>

      <div class="form-actions">
        <button type="submit" class="save-button">
          Save Task
        </button>

        <button
          type="button"
          class="cancel-button"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.45);
}

.task-form {
  width: 90%;
  max-width: 500px;
  padding: 24px;

  background: white;
  border-radius: 12px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
}

.close-button {
  border: none;
  background: none;
  font-size: 28px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
}

.close-button:hover {
  color: #111827;
}

.task-form label {
  display: block;
  margin-bottom: 16px;
  font-weight: 600;
}

.task-form input,
.task-form textarea,
.task-form select {
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;

  border: 1px solid #d1d5db;
  border-radius: 6px;

  font: inherit;
  box-sizing: border-box;
}

.task-form textarea {
  min-height: 90px;
  resize: vertical;
}

.task-form input:focus,
.task-form textarea:focus,
.task-form select:focus {
  outline: none;
  border-color: #6366f1;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
}

.save-button {
  background: #6366f1;
  color: white;
}

.cancel-button {
  background: #e5e7eb;
  color: #374151;
}

.form-actions button:hover {
  opacity: 0.9;
}
</style>