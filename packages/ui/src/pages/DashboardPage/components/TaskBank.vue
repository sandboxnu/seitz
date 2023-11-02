<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";
import { ref } from "vue";

const tasks = ref([
  {
    id: 1,
    name: "Boston Naming",
  },
  {
    id: 2,
    name: "AVDAT",
  },
  {
    id: 3,
    name: "Cancellation",
  },
  {
    id: 4,
    name: "Complex Corsi",
  },
]);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl mb-2">Tasks</h1>
    <Draggable v-model="tasks" group="taskbar" handle=".handle" item-key="id">
      <template #item="{ element }">
        <TaskCard :name="element.name" class="mb-2" />
      </template>
    </Draggable>
  </div>
</template>
