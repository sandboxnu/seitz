<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";

import useImmutable from "@/util/useImmutable";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { computed } from "vue";

const props = defineProps<{
  draggable: boolean;
  sessionId: string;
  index: number;
}>();

const studyBuilderStore = useStudyBuilderStore();

const session = computed(() => studyBuilderStore.sessionData[props.sessionId]);

const tasks = useImmutable(() => session.value.tasks);

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  ghostClass: "invisible",
  animation: 100,
};
</script>

<template>
  <div
    class="flex flex-col px-6 pb-5 border rounded-xl border-black overflow-y-hidden"
  >
    <div v-if="draggable" class="handle cursor-pointer self-center">
      <ElImage src="/icons/grip-horizontal.svg" fit="cover" />
    </div>
    <div class="flex items-center gap-2.5 mt-3 mb-4">
      <div
        class="px-1.5 flex items-center justify-center rounded-[4px] border-[1.5px] border-neutral-300 bg-neutral-100 text-neutral-500 font-bold text-sm"
      >
        {{ index }}
      </div>
      <input
        v-model="session.name"
        type="text"
        class="text-2xl w-full rounded bg-transparent"
        placeholder="Untitled Session"
      />
    </div>
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="tasks"
        v-bind="draggableProps"
        class="flex-1 overflow-y-auto"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="_id"
        @change="(event) => studyBuilderStore.handleChange(sessionId, event)"
      >
        <template #item="{ element }">
          <TaskCard draggable :task-id="element.task" class="mb-2" />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
