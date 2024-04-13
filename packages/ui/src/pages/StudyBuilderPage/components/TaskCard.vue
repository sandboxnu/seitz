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
      'flex items-center pl-1.5 pr-3 py-2.5 gap-2 rounded-xl border border-neutral-300 bg-neutral-10',
      { 'cursor-pointer': draggable },
    ]"
    @click="taskEditingStore.select(taskId)"
  >
    <ElImage class="shrink-0" src="/icons/grip-vertical.svg" fit="cover" />
    <ElImage
      :src="studyBuilderStore.taskData[taskId].battery.imageUrl"
      fit="cover"
      class="h-9 w-9 rounded-lg shrink-0"
    />
    <div class="truncate">
      <p class="text-neutral-500 text-[10px] font-semibold">
        {{ studyBuilderStore.taskData[taskId].battery.name }}
      </p>
      <p
        class="overflow-hidden text-neutral-600 text-ellipsis text-base font-medium"
      >
        {{ studyBuilderStore.taskData[taskId].name }}
      </p>
    </div>
    <div class="grow"></div>
    <ElImage class="shrink-0" src="/icons/close.svg" fit="cover" />
  </div>
</template>
