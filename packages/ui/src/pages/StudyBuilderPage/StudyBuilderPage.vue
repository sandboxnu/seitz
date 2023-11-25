<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import AppButton from "@/components/ui/AppButton.vue";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import TaskLibrary from "./components/TaskLibrary.vue";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const dialogVisible = ref(false);
</script>

<template>
  <!-- This is sort of a hack to delete elements if they are dropped outside of sessions -->
  <Draggable
    class="flex-1 flex overflow-auto"
    ghost-class="hidden"
    :group="{ put: ['taskbar', 'session'] }"
    item-key=""
  >
    <template #header>
      <TaskBank class="flex-none w-72" @show-add="dialogVisible = true" />
      <StudyPanel class="grow basis-[750px] shrink-0" />
    </template>
    <template #item></template>
  </Draggable>
  <ElDialog
    v-model="dialogVisible"
    class="rounded-3xl max-h-[500px] overflow-auto"
    title="Battery Library"
    width="80%"
    align-center
    :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="flex items-center gap-5 px-5">
        <FontAwesomeIcon
          :icon="['fas', 'xmark']"
          class="w-5 h-5 cursor-pointer"
          @click="close"
        />
        <div class="flex-1">
          <p :id="titleId" :class="['text-xl', titleClass]">Task Library</p>
          <p class="font-light">Select tasks to add to your task bank</p>
        </div>
        <AppButton @click="close">Save</AppButton>
      </div>
    </template>
    <TaskLibrary />
  </ElDialog>
</template>
