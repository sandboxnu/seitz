<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";
import { ref } from "vue";

defineProps<{ name: string; draggable: boolean }>();

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
  <div class="flex flex-col p-6 border rounded-xl border-black">
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-horizontal']"
      class="handle cursor-pointer pr-1"
    />
    <h1 class="text-2xl mb-2">
      <input type="text" :value="name" class="w-full rounded bg-transparent" />
    </h1>
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="tasks"
        v-bind="draggableProps"
        class="flex-1"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="id"
      >
        <template #item="{ element }">
          <TaskCard
            :key="element.id"
            draggable
            :name="element.name"
            class="mb-2"
          />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
