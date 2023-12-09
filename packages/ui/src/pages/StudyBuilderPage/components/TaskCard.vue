<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";

defineProps<{ taskId: string; draggable: boolean }>();

const studyBuilderStore = useStudyBuilderStore();
</script>

<template>
  <div
    :class="[
      'border',
      'rounded-lg',
      'p-2',
      'border-black',
      { 'cursor-pointer': draggable },
    ]"
    @click="studyBuilderStore.editingTaskId = taskId"
  >
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-vertical']"
      class="handle cursor-pointer pr-1"
    />
    {{ studyBuilderStore.taskData[taskId].name }}
  </div>
</template>
