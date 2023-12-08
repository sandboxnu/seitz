<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { useTaskEditingStore } from "@/stores/taskEditing";

defineProps<{ taskId: string; draggable: boolean }>();

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();
</script>

<template>
  <div
    :class="[
      'rounded-lg p-2 border border-black flex items-center gap-2',
      { 'cursor-pointer': draggable },
    ]"
    @click="taskEditingStore.select(taskId)"
  >
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-vertical']"
      class="handle"
    />
    <div class="truncate">
      {{ studyBuilderStore.taskData[taskId].name }}
    </div>
  </div>
</template>
