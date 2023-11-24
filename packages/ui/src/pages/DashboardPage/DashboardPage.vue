<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import Draggable from "vuedraggable";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const studyBuilderStore = useStudyBuilderStore();
</script>

<template>
  <!-- This is sort of a hack to delete elements if they are dropped outside of sessions -->
  <Draggable
    v-loading="studyBuilderStore.isStudyLoading"
    class="flex-1 flex"
    ghost-class="hidden"
    :group="{ put: ['taskbar', 'session'] }"
    item-key=""
  >
    <template #header>
      <TaskBank class="flex-none w-72" />
      <StudyPanel class="flex-1" />
    </template>
    <template #item></template>
  </Draggable>
</template>
