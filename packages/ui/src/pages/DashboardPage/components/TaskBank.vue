<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import Draggable from "vuedraggable";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import AppButton from "@/components/ui/AppButton.vue";
import { ref } from "vue";
import TaskLibrary from "./TaskLibrary.vue";

const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-400",
  dragClass: "bg-gray-400",
  animation: 100,
};

const libraryVisible = ref(false);
</script>

<template>
  <div class="flex p-6">
    <div class="flex flex-col">
      <h1 class="text-2xl mb-2">Tasks</h1>
      <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
        <template #template>
          <div class="w-60">
            <ElSkeletonItem
              v-for="i in 4"
              :key="i"
              variant="rect"
              class="h-[42px] rounded-lg mb-1"
            />
          </div>
        </template>
        <template #default>
          <TransitionGroup>
            <Draggable
              key="draggable"
              v-model="studyBuilderStore.taskBank"
              v-bind="draggableProps"
              :group="{ name: 'taskbar', pull: 'clone', put: false }"
              item-key="_id"
              class="flex-1 flex flex-col items-center w-60"
              :sort="false"
            >
              <template #item="{ element: taskId }">
                <TaskCard
                  draggable
                  :name="studyBuilderStore.taskData[taskId].name"
                  class="mb-2 w-full"
                />
              </template>
              <template #footer>
                <AppButton v-if="!libraryVisible" @click="libraryVisible = true"
                  >Add Task</AppButton
                >
              </template>
            </Draggable>
          </TransitionGroup>
        </template>
      </ElSkeleton>
    </div>
    <Transition name="slide">
      <div v-if="libraryVisible" class="flex-none flex justify-end">
        <div class="w-[804px] flex justify-end">
          <div
            class="flex-none w-[780px] overflow-y-auto border-2 border-black rounded-3xl p-5 flex flex-col items-end gap-2"
          >
            <AppButton @click="libraryVisible = false">Done</AppButton>
            <TaskLibrary />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: 0.5s;
  transition-property: width;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  width: 804px;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
}
</style>
