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
  <div
    class="bg-neutral-10 fixed flex items-stretch h-full border border-neutral-300 rounded-l-2xl px-6 py-8 shadow-2xl right-0"
  >
    <div class="flex flex-col w-[216px]">
      <div class="flex mb-5 items-center">
        <h1 class="text-2xl font-bold">Task Bank</h1>
        <div class="grow"></div>
        <AppButton v-if="!libraryVisible" @click="libraryVisible = true">
          Add
        </AppButton>
      </div>
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
              class="flex-1 flex flex-col gap-2 overflow-y-auto"
              :sort="false"
            >
              <template #item="{ element: taskId }">
                <TaskCard
                  draggable
                  :task-id="taskId"
                  :instance-id="null"
                  :session-id="null"
                />
              </template>
            </Draggable>
          </TransitionGroup>
        </template>
      </ElSkeleton>
    </div>
    <Transition name="slide">
      <div v-if="libraryVisible" class="h-full">
        <div class="w-[732px] h-full flex flex-col gap-3 ml-8">
          <div class="self-end">
            <AppButton @click="libraryVisible = false">
              Finish Adding Tasks
            </AppButton>
          </div>
          <div
            class="grow overflow-y-hidden bg-neutral-50 border border-neutral-300 rounded-2xl p-5 flex flex-col"
          >
            <p class="text-2xl text-black font-bold">Task Library</p>
            <div class="overflow-y-auto pt-5 w-full flex justify-center">
              <TaskLibrary />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <div class="w-[216px] mx-6"></div>
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
