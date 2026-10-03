<script setup lang="ts">
import type { Task } from '../types/task';

defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  open: [];
}>();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === 'done') {
    return false;
  }

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const todayString = `${year}-${month}-${day}`;

  return task.dueDate < todayString;
}
</script>

<template>
  <article
    class="task-card"
    @click="emit('open')"
  >
    <h3>{{ task.title }}</h3>

    <p v-if="task.description">
      {{ task.description }}
    </p>

   <div class="task-dates">
    <small v-if="task.dueDate">
        Due: {{ formatDate(task.dueDate) }}
    </small>

    <small>
        Created: {{ formatDate(task.createdAt) }}
    </small>
    <span
        v-if="isOverdue(task)"
        class="overdue-label"
    >
        Overdue
    </span>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

.task-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.task-card h3 {
  margin: 0 0 8px;
}

.task-card p {
  margin: 0 0 12px;
  color: #555;
}

.task-card small {
  color: #777;
}

.task-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-card small {
  color: #777;
}

.overdue-label {
  display: inline-block;
  width: fit-content;
  margin-top: 10px;

  padding: 3px 8px;

  border-radius: 999px;

  background: #fee2e2;
  color: #b91c1c;

  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
</style>