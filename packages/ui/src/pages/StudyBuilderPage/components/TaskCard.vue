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
      'flex items-center w-214 p-2 gap-2 rounded-lg border border-gray-300 bg-white',
      { 'cursor-pointer': draggable },
    ]"
    @click="taskEditingStore.select(taskId)"
  >
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-vertical']"
      class="handle"
    />
    <ElImage
      :src="studyBuilderStore.taskData[taskId].battery.imageUrl"
      fit="cover"
      class="h-9 w-9"
    />
    <div class="truncate">
      <p class="text-brown-dark font-lato text-xs">
        {{ studyBuilderStore.taskData[taskId].battery.name }}
      </p>
      <p
        class="overflow-hidden text-black text-ellipsis font-lato text-base font-semibold"
      >
        {{ studyBuilderStore.taskData[taskId].name }}
      </p>
    </div>
    <div class="grow"></div>
    <FontAwesomeIcon :icon="['fas', 'xmark']" />
  </div>
</template>
