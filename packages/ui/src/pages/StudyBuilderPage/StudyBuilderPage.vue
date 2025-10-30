<script setup lang="ts">
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";

import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import { useTaskEditingStore } from "@/stores/taskEditing";
import TaskEditPanel from "./components/TaskEditPanel.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();

function returnToConditions() {
  const id = studyBuilderStore.studyId;
  if (id) {
    router.push({ name: "conditions", params: { id } });
  } else {
    // Fallback: simple history back if id is missing for some reason
    router.back();
  }
}
</script>

<template>
  <div>
    <button
      class="inline-flex items-center text-neutral-600 mx-4 mt-4"
      type="button"
      @click="returnToConditions"
    >
      <img
        src="../../../public/icons/back-button.svg"
        alt="Back"
        class="h-4 w-4"
      />
      <span>Back</span>
    </button>

    <!-- This is sort of a hack to delete elements if they are dropped outside of sessions -->
    <Draggable
      v-loading="studyBuilderStore.isStudySaving"
      class="flex-1 flex overflow-auto"
      ghost-class="hidden"
      :group="{ put: ['taskbar', 'session'] }"
      item-key=""
    >
      <template #header>
        <StudyPanel class="grow basis-[750px] shrink-0" />
        <TaskBank class="flex-none" />
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
      <TaskEditPanel />
    </AppEditModal>
  </div>
</template>
