<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref } from "vue";

const selectedOption = ref("Details");
const studyBuilderStore = useStudyBuilderStore();
</script>

<template>
  <div
    class="bg-neutral-10 fixed flex flex-col items-stretch h-full border border-neutral-300 rounded-l-2xl px-6 py-8 shadow-2xl right-0"
  >
    <div class="flex flex-col w-[216px] mb-5">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold">smth goes here</h1>
      </div>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex space-x-4 mb-4">
        <button
          :class="{
            'border-b-2 border-red-500': selectedOption === 'Details',
            'text-gray-500': selectedOption !== 'Details',
          }"
          class="pb-2 text-lg font-medium"
          @click="selectedOption = 'Details'"
        >
          Details
        </button>
        <button
          :class="{
            'border-b-2 border-red-500': selectedOption === 'Sessions',
            'text-gray-500': selectedOption !== 'Sessions',
          }"
          class="pb-2 text-lg font-medium"
          @click="selectedOption = 'Sessions'"
        >
          Sessions
        </button>
      </div>
      <div>
        <div
          v-if="selectedOption === 'Details'"
          class="max-w-[200px] break-words"
        >
          <div class="mb-4">
            <h class="font-bold mb-2">Description</h>
            <p>{{ studyBuilderStore.description }}</p>
          </div>

          <div class="mb-4">
            <h class="font-bold mt-4 mb-2">Type</h>
            <p>wut is this?</p>
          </div>
          <div class="mb-4">
            <h class="font-bold mt-4 mb-2">Condition Server Code</h>
            <p>and this lol</p>
          </div>
          <div class="mb-4">
            <h class="font-bold mt-4 mb-2">Tags</h>
            <p>todo</p>
          </div>
        </div>
        <div v-else-if="selectedOption === 'Sessions'">
          <div class="flex flex-col space-y-4 overflow-y-auto max-h-[400px]">
            <p
              v-for="(session, index) in studyBuilderStore.sessions"
              :key="index"
            >
              {{ session }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: 0.75s;
  transition-property: width;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  width: 764px;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
}
</style>
