<script setup lang="ts">
import { computed } from "vue";
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

// Creates list of unique task types (by task id)
const uniqueTasksAll = computed(() => {
  const seen = new Set<string>();
  const uniqueTasks: { _id: string; task: string; quantity: number }[] = [];
  for (const t of props.session.tasks) {
    if (!seen.has(t.task)) {
      seen.add(t.task);
      uniqueTasks.push(t);
    }
  }
  return uniqueTasks;
});

// Shows at most three tasks in session card (unique)
const tasksToShow = computed(() => uniqueTasksAll.value.slice(0, 3));

// Calculates and maps quantity of each task to its id
const taskCounts = computed(() => {
  const counts = new Map<string, number>();
  for (const t of props.session.tasks) {
    const id = t.task;
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return counts;
});
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
    <div class="flex items-center justify-between gap-2.5 my-3 px-3 w-full">
      <div class="text-neutral-500 font-bold text-base">
        {{ props.session.name }}
      </div>
    </div>

    <div
      class="inline-flex flex-col justify-between items-start gap-3 border-l border-neutral-300 pl-3 w-full ml-10"
    >
      <div
        v-for="element in tasksToShow"
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
        <div class="text-stone-900 text-xs">
          ...{{ taskCounts.get(element.task) || 1 }}
        </div>
      </div>
      <div v-if="uniqueTasksAll.length > 3" class="text-black text-xs">...</div>
    </div>
  </div>
</template>
