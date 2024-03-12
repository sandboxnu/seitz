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
  <div class="flex p-6 bg-white">
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
              class="flex-1 flex flex-col items-center w-60 overflow-y-auto"
              :sort="false"
            >
              <template #item="{ element: taskId }">
                <TaskCard draggable :task-id="taskId" class="mb-2 w-full" />
              </template>
              <template #footer>
                <AppButton
                  v-if="!libraryVisible"
                  @click="libraryVisible = true"
                >
                  Add Task
                </AppButton>
              </template>
            </Draggable>
          </TransitionGroup>
        </template>
      </ElSkeleton>
    </div>
    <Transition name="slide">
      <div v-if="libraryVisible" class="flex-none flex justify-end">
        <div class="w-[764px] flex justify-end">
          <div
            class="flex-none w-[740px] overflow-y-hidden border-2 border-black rounded-3xl pt-5 flex flex-col"
          >
            <div
              class="self-stretch flex items-center gap-5 mx-5 px-5 py-3 border-b border-neutral-300"
            >
              <div class="flex-1">
                <p class="text-xl text-black font-bold">Task Library</p>
                <p class="font-light">Select tasks to add to your task bank</p>
              </div>
              <AppButton @click="libraryVisible = false">Done</AppButton>
            </div>
            <div class="overflow-y-auto pt-5 w-full flex justify-center">
              <TaskLibrary />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: 0.75s;
  transition-property: width;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  width: 764px;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
}
</style>
