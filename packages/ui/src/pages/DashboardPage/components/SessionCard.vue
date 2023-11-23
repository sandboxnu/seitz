<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";

import useImmutable from "@/util/useImmutable";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { computed } from "vue";

const props = defineProps<{
  draggable: boolean;
  sessionId: string;
}>();

const studyBuilderStore = useStudyBuilderStore();

const session = computed(() => studyBuilderStore.sessionData[props.sessionId]);

const tasks = useImmutable(session.value.tasks);

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  ghostClass: "invisible",
  animation: 100,
};
</script>

<template>
  <div class="flex flex-col p-6 border rounded-xl border-black">
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-horizontal']"
      class="handle cursor-pointer pr-1"
    />
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="tasks"
        v-bind="draggableProps"
        class="flex-1"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="key"
        @change="(event) => studyBuilderStore.handleChange(sessionId, event)"
      >
        <template #header>
          <input
            v-model="session.name"
            type="text"
            class="text-2xl mb-2 w-full rounded bg-transparent"
            placeholder="Untitled Session"
          />
        </template>
        <template #item="{ element }">
          <TaskCard
            draggable
            :name="studyBuilderStore.taskData[element.taskId].name"
            class="mb-2"
          />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
