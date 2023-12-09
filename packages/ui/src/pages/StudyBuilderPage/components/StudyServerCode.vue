<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref } from "vue";

const studyBuilderStore = useStudyBuilderStore();

const copied = ref(false);

function copyCode() {
  if (!studyBuilderStore.studyId) return;
  navigator.clipboard.writeText(studyBuilderStore.studyId).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  });
}
</script>

<template>
  <div
    class="flex flex-col items-center font-light cursor-pointer"
    @click="copyCode"
  >
    <span class="text-gray-400 text-sm">
      {{ copied ? "Copied!" : "Server code" }}
    </span>
    <div
      :class="[
        'border rounded-lg px-5 py-1 flex items-center gap-1 w-full',
        copied ? 'bg-gray-300 border-gray-500' : 'bg-gray-200 border-gray-300',
      ]"
    >
      <span class="truncate">{{ studyBuilderStore.studyId }}</span>
      <FontAwesomeIcon :icon="['far', 'copy']" />
    </div>
  </div>
</template>
