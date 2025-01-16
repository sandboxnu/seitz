<!-- This component provides a side panel for task selection and editing. -->
<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { useTaskEditingStore } from "@/stores/taskEditing";
import TaskEditForm from "./TaskEditForm.vue";

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();
</script>

<template>
  <div class="flex h-full">
    <div class="w-72 h-full overflow-y-auto px-6 flex flex-col gap-2">
      <div
        v-for="task in studyBuilderStore.taskBank"
        :key="task"
        :class="[
          'w-full border rounded-lg p-2 cursor-pointer truncate',
          taskEditingStore.editingTaskId === task
            ? 'bg-gray-200 border-gray-700'
            : 'border-gray-400',
        ]"
        @click="taskEditingStore.select(task)"
      >
        {{ studyBuilderStore.taskData[task].name }}
      </div>
    </div>
    <div class="flex-1 border border-gray-400 rounded-xl overflow-hidden">
      <TaskEditForm />
    </div>
  </div>
</template>
