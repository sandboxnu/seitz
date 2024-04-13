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
    class="flex flex-col p-6 border rounded-xl border-black overflow-y-hidden"
  >
    <ElImage
      v-if="draggable"
      src="/sessions/grip-horizontal.png"
      fit="cover"
      class="handle cursor-pointer pr-1"
    />
    <!-- <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-horizontal']"
      class="handle cursor-pointer pr-1"
    /> -->
    <div class="flex items-center">
      <div
        class="w-6 h-6 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-neutral-500 font-lato text-lg font-bold"
      >
        {{ index }}
      </div>
      <input
        v-model="session.name"
        type="text"
        class="text-2xl mb-2 w-full rounded bg-transparent"
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
