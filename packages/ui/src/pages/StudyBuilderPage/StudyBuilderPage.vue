<script setup lang="ts">
import { useRouter } from "vue-router";
import Draggable from "vuedraggable";
import { computed } from "vue";
import authAPI from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import AppBreadcrumb from "@/components/ui/AppBreadcrumb.vue";
import { useTaskEditingStore } from "@/stores/taskEditing";
import TaskEditPanel from "./components/TaskEditPanel.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ElMessageBox } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();
const finishWelcomeWizard = () => {
  ElMessageBox.alert(
    "Congratulations! You've finished the walkthrough.",
    "Finish",
    {
      confirmButtonText: "Close",
      customStyle: { borderRadius: "10px", width: "278px", height: "160px" },
      customClass: "finish-msgbox",
    }
  );
};

if (!authStore.currentUser) {
  router.push("/login");
}

const studyBuilderStore = useStudyBuilderStore();
const taskEditingStore = useTaskEditingStore();
const welcomeWizardStep = computed(
  () => authStore.currentUser?.welcomeWizardStep ?? 0
);

const updateWizardSteps = (step: number) => {
  authAPI.updateCurrentUser({ welcomeWizardStep: step });
  if (authStore.currentUser) authStore.currentUser.welcomeWizardStep = step;
};
</script>

<template>
  <div>
    <AppBreadcrumb />
    <Draggable
      v-loading="studyBuilderStore.isStudySaving"
      class="flex-1 flex overflow-auto"
      ghost-class="hidden"
      :group="{ put: ['taskbar', 'session'] }"
      item-key=""
    >
      <template #header>
        <StudyPanel class="grow basis-[750px] shrink-0" />
        <el-popover
          :visible="welcomeWizardStep == 2"
          teleported="false"
          title="Drag Task to Session"
          placement="left"
          width="295px"
          popper-style="border-radius: 10px;"
          :hide-after="0"
          trigger="manual"
        >
          <template #default>
            Populate the session with tasks by dragging task cards from the task
            bank to the session.
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
              "
            >
              <el-button
                class="close-tip"
                style="
                  width: 59px;
                  height: 36px;
                  border-radius: 10px;
                  border-width: 1px;
                  border-color: #c3bcb5;
                  background-color: #fffdfd;
                  font-size: 14px;
                  font-weight: 700;
                "
                @click="
                  updateWizardSteps(welcomeWizardStep + 1);
                  finishWelcomeWizard();
                "
                >Close</el-button
              >
              <div style="font-weight: 500; font-size: 14px">3/3</div>
              <el-button
                type="text"
                style="font-size: 14px; font-weight: 500; color: #8a7f75"
                @click="updateWizardSteps(3)"
                >Skip all tips</el-button
              >
            </div>
          </template>
          <template #reference>
            <div>
              <TaskBank class="flex-none" />
            </div>
          </template>
        </el-popover>
        <div
          v-if="welcomeWizardStep == 2"
          style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5)"
        ></div>
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

<style>
.finish-msgbox .el-message-box__btns {
  display: flex !important;
  justify-content: center !important;
}
.finish-msgbox .el-message-box__btns .el-button--primary {
  width: 59px;
  height: 36px;
  border-radius: 10px;
  background-color: #1f1915;
  border: none !important;
  color: #fffdfd;
  font-size: 14px;
  font-weight: 700;
}

.finish-msgbox .el-message-box__btns .el-button--primary:focus {
  outline: none !important;
}

.finish-msgbox .el-message-box__title {
  font-weight: 700 !important;
  font-size: 14px !important;
}

.finish-msgbox .el-message-box__message {
  font-size: 14px !important;
}
</style>
