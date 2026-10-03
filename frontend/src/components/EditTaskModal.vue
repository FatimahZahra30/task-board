<script setup lang="ts">
import { ref } from 'vue';
import { X, Trash2 } from 'lucide-vue-next';
import type { Task, TaskStatus } from '../types/task';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  close: [];
  taskUpdated: [];
  taskDeleted: [];
}>();

const title = ref(props.task.title);
const description = ref(props.task.description ?? '');
const status = ref<TaskStatus>(props.task.status);
const dueDate = ref(props.task.dueDate ?? '');

async function updateTask() {
  const response = await fetch(
    `http://localhost:3000/tasks/${props.task.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value || undefined,
        status: status.value,
        dueDate: dueDate.value || undefined
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    alert(error.error);
    return;
  }

  emit('taskUpdated');
}

async function deleteTask() {
  const confirmed = confirm(
    'Are you sure you want to delete this task?'
  );

  if (!confirmed) {
    return;
  }

  const response = await fetch(
    `http://localhost:3000/tasks/${props.task.id}`,
    {
      method: 'DELETE'
    }
  );

  if (!response.ok) {
    const error = await response.json();
    alert(error.error);
    return;
  }

  emit('taskDeleted');
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <form class="task-form" @submit.prevent="updateTask">

      <div class="form-header">
        <h2>Edit Task</h2>

        <button
          type="button"
          class="close-button"
          @click="emit('close')"
          aria-label="Close"
        >
          <X :size="20" />
        </button>
      </div>

      <label>
        Title
        <input
          v-model="title"
          type="text"
          maxlength="100"
          required
        />
      </label>

      <label>
        Description
        <textarea
          v-model="description"
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
        <button
          type="submit"
          class="save-button"
        >
          Save Changes
        </button>

        <button
          type="button"
          class="delete-button"
          @click="deleteTask"
        >
          <Trash2 :size="17" />
          Delete Task
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
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: none;

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

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

.delete-button {
  background: #fee2e2;
  color: #b91c1c;
}

.form-actions button:hover {
  opacity: 0.9;
}
</style>