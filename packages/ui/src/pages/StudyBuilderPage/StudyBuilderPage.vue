<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import TaskLibrary from "./components/TaskLibrary.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import TaskEditingForm from "./components/TaskEditingForm.vue";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const studyBuilderStore = useStudyBuilderStore();
const libraryVisible = ref(false);
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
        @show-add="libraryVisible = true"
      />
      <StudyPanel class="grow basis-[650px] shrink-0" />
    </template>
    <template #item></template>
  </Draggable>
  <AppEditModal
    :visible="libraryVisible"
    header="Task Library"
    sub-header="Select tasks to add to your task bank"
    @cancel="libraryVisible = false"
    @save="libraryVisible = false"
  >
    <TaskLibrary />
  </AppEditModal>
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
      :battery-id="studyBuilderStore.editingTask!.battery"
    />
  </AppEditModal>
</template>
