<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { useTaskEditingStore } from "@/stores/taskEditing";
import { Close } from "@element-plus/icons-vue";

defineProps<{
  taskId: string;
  instanceId: string | null;
  sessionId: string | null;
  draggable: boolean;
}>();

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();
</script>

<template>
  <div
    :class="[
      'group flex items-center pl-1.5 pr-3 py-2.5 gap-2 rounded-xl border border-neutral-200 bg-neutral-50',
      { 'cursor-pointer': draggable },
    ]"
    @click="taskEditingStore.select(taskId)"
  >
    <ElImage
      class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      src="/icons/grip-vertical.svg"
      fit="cover"
    />
    <ElImage
      :src="studyBuilderStore.taskData[taskId].battery.imageUrl"
      fit="cover"
      class="h-9 w-9 rounded-lg shrink-0"
    />
    <div class="grow truncate">
      <p class="text-neutral-500 text-[10px] font-semibold">
        {{ studyBuilderStore.taskData[taskId].battery.name }}
      </p>
      <p
        class="overflow-hidden text-neutral-600 text-ellipsis text-base font-medium"
      >
        {{ studyBuilderStore.taskData[taskId].name }}
      </p>
    </div>
    <el-button
      :icon="Close"
      class="border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg"
      circle
      @click.stop="
        studyBuilderStore.removeCustomizedTaskOrInstance(
          instanceId,
          taskId,
          sessionId
        )
      "
    />
  </div>
</template>
