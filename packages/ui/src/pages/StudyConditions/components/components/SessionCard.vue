<script setup lang="ts">
import { computed } from "vue";
import Draggable from "vuedraggable";
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

const emit = defineEmits(["update:session"]);

const tasks = computed({
  get: () => props.session.tasks,
  set: (newTasks) => {
    // updates session everytime tasks are changed
    emit("update:session", { ...props.session, tasks: newTasks });
  },
});

const draggableProps = {
  ghostClass: "invisible",
  animation: 100,
};
</script>

<template>
  <div
    class="w-52 h-52 flex flex-col items-center border rounded-3xl border-neutral-300 overflow-y-hidden p-3"
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

    <TransitionGroup>
      <Draggable
        v-model="tasks"
        v-bind="draggableProps"
        class="inline-flex flex-col justify-start items-start gap-3"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="_id"
      >
        <template #item="{ element }">
          <div class="inline-flex justify-start items-center">
            <div class="justify-center text-black text-xs">
              {{ studyBuilderStore.getTaskName(element.task) }}
            </div>
            <div class="justify-center text-stone-900 text-xs">
              {{ element.quantity }}
            </div>
          </div>
        </template>
      </Draggable>
    </TransitionGroup>

    <div
      class="mt-auto self-stretch text-center justify-center text-stone-500 text-xs"
    >
      id: {{ props.session._id }}
    </div>
  </div>
</template>
