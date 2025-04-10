<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref, computed } from "vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";

const selectedOption = ref("Details");
const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  animation: 100,
};

const sessionList = computed(() =>
  Object.values(studyBuilderStore.sessionData)
);
</script>

<template>
  <div
    class="bg-neutral-10 fixed flex flex-col items-stretch h-full border border-neutral-300 rounded-l-2xl px-6 pt-8 shadow-2xl right-0 w-[300px]"
  >
    <div class="flex flex-col w-full mb-5">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold">smth goes here</h1>
      </div>
    </div>
    <div class="flex flex-col w-full flex-1 overflow-hidden">
      <div class="flex space-x-4 mb-4">
        <button
          :class="{
            'border-b-2 border-red-500 text-black':
              selectedOption === 'Details',
            'text-gray-500': selectedOption !== 'Details',
          }"
          class="pb-2 text-lg font-medium"
          @click="selectedOption = 'Details'"
        >
          Details
        </button>
        <button
          :class="{
            'border-b-2 border-red-500 text-black':
              selectedOption === 'Sessions',
            'text-gray-500': selectedOption !== 'Sessions',
          }"
          class="pb-2 text-lg font-medium"
          @click="selectedOption = 'Sessions'"
        >
          Sessions
        </button>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-if="selectedOption === 'Details'" class="h-full flex flex-col">
          <div class="mb-2">
            <h2 class="font-bold mb-1">Description</h2>
            <p>{{ studyBuilderStore.description }}</p>
          </div>

          <div class="mb-2">
            <h2 class="font-bold mt-2 mb-1">Type</h2>
            <p>wut is this?</p>
          </div>
          <div class="mb-2">
            <h2 class="font-bold mt-2 mb-1">Condition Server Code</h2>
            <p>and this lol</p>
          </div>
          <div class="mb-2">
            <h2 class="font-bold mt-2 mb-1">Tags</h2>
            <p>todo</p>
          </div>
        </div>
        <div
          v-else-if="selectedOption === 'Sessions'"
          class="flex-1 overflow-y-auto flex flex-col"
        >
          <TransitionGroup>
            <Draggable
              key="draggable"
              v-model="sessionList"
              v-bind="draggableProps"
              :group="{ name: 'taskbar', pull: 'clone', put: false }"
              item-key="_id"
              class="flex flex-col gap-2"
              :sort="false"
            >
              <template #item="{ element: session }">
                <SessionCard :key="session._id" :session="session" draggable />
              </template>
            </Draggable>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
