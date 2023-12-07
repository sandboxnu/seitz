<script setup lang="ts">
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import { useTaskEditingStore } from "@/stores/taskEditing";
import TaskEditingPanel from "./components/TaskEditingPanel.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();
</script>

<template>
  <!-- This is sort of a hack to delete elements if they are dropped outside of sessions -->
  <Draggable
    v-loading="
      studyBuilderStore.isStudyLoading || studyBuilderStore.isStudySaving
    "
    class="flex-1 flex overflow-auto"
    ghost-class="hidden"
    :group="{ put: ['taskbar', 'session'] }"
    item-key=""
  >
    <template #header>
      <TaskBank class="flex-none border border-black" />
      <StudyPanel class="grow basis-[650px] shrink-0" />
    </template>
    <template #item></template>
  </Draggable>
  <AppEditModal
    :visible="taskEditingStore.editingTaskId !== undefined"
    header="Edit Task"
    sub-header="Customize your task"
    @cancel="taskEditingStore.editingTaskId = undefined"
    @done="taskEditingStore.editingTaskId = undefined"
  >
    <TaskEditingPanel />
  </AppEditModal>
</template>
