<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref, computed } from "vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";

const selectedOption = ref("Details");
const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-100",
  dragClass: "bg-gray-400",
  animation: 100,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const variantData = computed<Record<string, any>>({
  get: () => {
    return (
      studyBuilderStore.variants.find(
        (variant) => variant._id === studyBuilderStore.currentVariantId
      ) || {}
    );
  },
  set(newData) {
    const index = studyBuilderStore.variants.findIndex(
      (variant) => variant._id === studyBuilderStore.currentVariantId
    );
    if (index !== -1) {
      studyBuilderStore.variants[index] = {
        ...studyBuilderStore.variants[index],
        ...newData,
      };
    }
  },
});

function updateVariantName() {
  // TODO: Make database update
}
</script>

<template>
  <div
    class="bg-neutral-10 fixed flex flex-col items-stretch h-full border border-neutral-300 rounded-l-2xl px-6 pt-8 shadow-2xl right-0 w-[300px]"
  >
    <div class="flex flex-col w-full mb-5">
      <div class="flex items-center">
        <ElImage src="/icons/pencil.svg" />
        <input
          v-model="variantData.name"
          class="w-fit bg-transparent text-neutral-600 font-bold text-2xl"
          type="text"
          placeholder="Untitled variant"
          @change="updateVariantName"
        />
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
            <p>{{ variantData.description || "No description" }}</p>
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
          <Draggable
            v-model="variantData.sessions"
            v-bind="draggableProps"
            :group="{ name: 'sessions', pull: 'clone', put: true }"
            item-key="_id"
            class="flex flex-col gap-2"
          >
            <template #item="{ element: session }">
              <SessionCard :key="session._id" :session="session" draggable />
            </template>
          </Draggable>
        </div>
      </div>
    </div>
  </div>
</template>
