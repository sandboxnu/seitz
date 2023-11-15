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

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  ghostClass: "bg-gray-200",
  animation: 100,
};
</script>

<template>
  <div class="border border-black p-6 flex flex-col">
    <h1 class="text-2xl mb-2">Tasks</h1>
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="tasks"
        v-bind="draggableProps"
        :group="{ name: 'taskbar', pull: 'clone', put: false }"
        item-key="id"
        class="flex-1"
        :sort="false"
      >
        <template #item="{ element }">
          <TaskCard draggable :name="element.name" class="mb-2" />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
