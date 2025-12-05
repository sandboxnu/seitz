<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref } from "vue";

const studyBuilderStore = useStudyBuilderStore();

const copied = ref(false);

function copyCode() {
  navigator.clipboard.writeText(studyBuilderStore.serverCode).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  });
}
</script>

<template>
  <el-button class="border rounded-lg px-3 py-1" @click="copyCode">
    <FontAwesomeIcon :icon="['far', 'copy']" />
  </el-button>

  <div class="flex flex-col items-center font-light cursor-pointer">
    <span class="text-gray-400 text-sm">
      {{ copied ? "Copied!" : "Server Code" }}
    </span>
    <div
      :class="[
        'border rounded-lg px-5 py-1 flex items-center justify-center gap-1 w-40',
        copied
          ? 'bg-neutral-0 border-gray-500'
          : 'bg-neutral-0 border-gray-300',
      ]"
    >
      <input
        v-model="studyBuilderStore.serverCode"
        type="text"
        class="truncate text-center border-none bg-neutral-0 w-full focus:outline-none"
      />
    </div>
  </div>
</template>
