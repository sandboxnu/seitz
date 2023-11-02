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
  <div class="p-6 flex flex-col grow">
    <h1 class="text-2xl mb-2">Tasks</h1>
    <Draggable
      v-model="tasks"
      :group="{ name: 'taskbar', pull: 'clone', put: false }"
      item-key="id"
      class="grow"
      chosenClass="bg-gray-400"
      dragClass="bg-gray-400"
      ghostClass="bg-gray-200"
      :sort="false"
    >
      <template #item="{ element }">
        <TaskCard draggable :name="element.name" class="mb-2" />
      </template>
    </Draggable>
  </div>
</template>
