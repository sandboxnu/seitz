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
  <div class="flex flex-col p-6 border rounded-lg border-black">
    <h1 class="text-2xl mb-2">Session 1</h1>
    <Draggable
      v-model="tasks"
      :group="{ name: 'session', put: ['taskbar', 'session'] }"
      item-key="id"
      class="grow"
      chosenClass="bg-gray-400"
      dragClass="bg-gray-400"
      ghostClass="bg-gray-200"
    >
      <template #item="{ element }">
        <TaskCard draggable :name="element.name" class="mb-2" />
      </template>
    </Draggable>
  </div>
</template>
