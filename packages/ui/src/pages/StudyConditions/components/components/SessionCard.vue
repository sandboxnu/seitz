<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const studyBuilderStore = useStudyBuilderStore();

const props = defineProps<{
  session: {
    _id: string;
    name: string;
    tasks: { _id: string; task: string; quantity: number }[];
  };
  draggable: boolean;
}>();
</script>

<template>
  <div
    class="w-52 h-52 flex flex-col items-center border rounded-3xl border-neutral-300 overflow-y-hidden p-3 bg-stone-50 outline-stone-300"
  >
    <!-- grip icon for dragging -->
    <ElImage
      v-if="draggable"
      src="/icons/grip-horizontal.svg"
      fit="cover"
      class="handle cursor-pointer self-center h-2"
    />

    <!-- header for session card -->
    <div class="flex items-center justify-between gap-2.5 mt-3 mb-3 w-full">
      <div class="flex items-center gap-2.5">
        <!-- placeholder for image icon -->
        <div
          class="w-8 h-8 bg-neutral-200 border border-neutral-300 rounded"
        ></div>

        <div class="text-neutral-600 font-bold text-base">
          {{ props.session.name }}
        </div>
      </div>

      <ElImage src="/icons/lock.svg" fit="cover" class="w-4 h-4 ml-auto" />
    </div>

    <div class="inline-flex flex-col justify-start items-start gap-3">
      <div
        v-for="element in props.session.tasks"
        :key="element._id"
        class="inline-flex justify-start items-center"
      >
        <div class="text-black text-xs">
          {{
            studyBuilderStore.getTaskName(element.task).length > 15
              ? studyBuilderStore.getTaskName(element.task).slice(0, 15)
              : studyBuilderStore.getTaskName(element.task)
          }}
        </div>
        <div class="text-stone-900 text-xs">...{{ element.quantity }}</div>
      </div>
    </div>
    <div v-if="props.session.tasks.length > 3" class="text-black text-xs">
      ...
    </div>
  </div>
</template>
