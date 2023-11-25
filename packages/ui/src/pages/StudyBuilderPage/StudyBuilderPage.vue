<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import TaskLibrary from "./components/TaskLibrary.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";

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
      <TaskBank
        class="flex-none w-72 overflow-y-auto"
        @show-add="dialogVisible = true"
      />
      <StudyPanel class="grow basis-[650px] shrink-0" />
    </template>
    <template #item></template>
  </Draggable>
  <AppEditModal
    :visible="dialogVisible"
    header="Task Library"
    sub-header="Select tasks to add to your task bank"
    @cancel="dialogVisible = false"
    @save="dialogVisible = false"
  >
    <TaskLibrary />
  </AppEditModal>
</template>
