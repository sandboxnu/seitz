<script setup lang="ts">
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import TaskEditingForm from "./components/TaskEditingForm.vue";

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
    v-if="studyBuilderStore.editingTask?.name !== undefined"
    :visible="studyBuilderStore.editingTaskId !== undefined"
    :header="studyBuilderStore.editingTask?.name"
    sub-header="Customize your task"
    @cancel="studyBuilderStore.editingTaskId = undefined"
    @save="studyBuilderStore.editingTaskId = undefined"
  >
    <TaskEditingForm
      v-if="studyBuilderStore.editingTaskId !== undefined"
      :custom-battery="studyBuilderStore.editingTask"
    />
  </AppEditModal>
</template>
