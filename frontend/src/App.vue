<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TaskCard from './components/TaskCard.vue';
import TaskForm from './components/TaskForm.vue';
import type { Task } from './types/task';
import EditTaskModal from './components/EditTaskModal.vue';

const columns = [
  { title: 'Todo', status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'Done', status: 'done' }
];

const tasks = ref<Task[]>([]);
const showAddForm = ref(false);

const selectedTask = ref<Task | null>(null);

function editTask(task: Task) {
  selectedTask.value = task;
}

async function handleTaskUpdated() {
  await fetchTasks();
  selectedTask.value = null;
}

async function handleTaskDeleted() {
  await fetchTasks();
  selectedTask.value = null;
}

async function fetchTasks() {
  const response = await fetch('http://localhost:3000/tasks');

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  tasks.value = await response.json();
}

async function handleTaskCreated() {
  await fetchTasks();
  showAddForm.value = false;
}

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <main class="app">
    <header class="header">
      <h1>Task Board</h1>
      <button
        class="add-button"
        @click="showAddForm = true"
      >
        + Add Task
      </button>
    </header>

    <TaskForm
      v-if="showAddForm"
      @cancel="showAddForm = false"
      @task-created="handleTaskCreated"
    />

    <EditTaskModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @task-updated="handleTaskUpdated"
      @task-deleted="handleTaskDeleted"
    />

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
            @open="editTask(task)"
          />
        </div>
      </div>
    </section>
  </main>
</template>