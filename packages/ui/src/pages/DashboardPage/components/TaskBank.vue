<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  animation: 100,
};
</script>

<template>
  <div class="border border-black p-6 flex flex-col">
    <h1 class="text-2xl mb-2">Tasks</h1>
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="studyBuilderStore.taskBank"
        v-bind="draggableProps"
        :group="{ name: 'taskbar', pull: 'clone', put: false }"
        item-key="id"
        class="flex-1"
        :sort="false"
      >
        <template #item="{ element: taskId }">
          <TaskCard
            draggable
            :name="studyBuilderStore.taskData[taskId].name"
            class="mb-2"
          />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
