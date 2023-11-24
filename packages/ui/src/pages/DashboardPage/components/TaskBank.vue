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
    <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
      <template #template>
        <ElSkeletonItem
          v-for="i in 4"
          :key="i"
          variant="rect"
          class="h-[42px] rounded-lg mb-1"
        />
      </template>
      <template #default>
        <TransitionGroup>
          <Draggable
            key="draggable"
            v-model="studyBuilderStore.taskBank"
            v-bind="draggableProps"
            :group="{ name: 'taskbar', pull: 'clone', put: false }"
            item-key="_id"
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
      </template>
    </ElSkeleton>
  </div>
</template>
