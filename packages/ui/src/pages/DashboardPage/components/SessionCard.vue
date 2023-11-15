<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";

import type { SortableEvent } from "sortablejs";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import * as _ from "lodash";
import { computed } from "vue";

const props = defineProps<{
  name: string;
  draggable: boolean;
  sessionId: string;
}>();

const studyBuilderStore = useStudyBuilderStore();

const session = computed(() => studyBuilderStore.sessionData[props.sessionId]);

function onAdd(event: SortableEvent) {
  let addedIndex = event.newIndex;
  if (!addedIndex) return;

  session.value.tasks[addedIndex].id = _.uniqueId();
}

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
        :list="session.tasks"
        v-bind="draggableProps"
        class="flex-1"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="id"
        @add="onAdd"
      >
        <template #header>
          <input
            type="text"
            class="text-2xl mb-2 w-full rounded bg-transparent"
            :value="name"
            placeholder="Untitled Session"
          />
        </template>
        <template #item="{ element }">
          <TaskCard
            :key="element.id"
            draggable
            :name="element.name"
            class="mb-2"
          />
        </template>
      </Draggable>
    </TransitionGroup>
  </div>
</template>
