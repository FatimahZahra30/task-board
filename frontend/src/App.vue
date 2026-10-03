<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TaskCard from './components/TaskCard.vue';
import type { Task } from './types/task';

const columns = [
  { title: 'Todo', status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'Done', status: 'done' }
];

const tasks = ref<Task[]>([]);

async function fetchTasks() {
  const response = await fetch('http://localhost:3000/tasks');

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  tasks.value = await response.json();
}

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <main class="app">
    <header class="header">
      <h1>Task Board</h1>
      <button class="add-button">+ Add Task</button>
    </header>

    <section class="board">
      <div
        v-for="column in columns"
        :key="column.status"
        class="column"
      >
        <h2>{{ column.title }}</h2>

        <div class="column-content">
          <TaskCard
            v-for="task in tasks.filter(task => task.status === column.status)"
            :key="task.id"
            :task="task"
          />
        </div>
      </div>
    </section>
  </main>
</template>