<script setup lang="ts">
import type { Task } from '../types/task';

defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  open: [];
}>();
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

    <small v-if="task.dueDate">
      Due: {{ task.dueDate }}
    </small>
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
</style>