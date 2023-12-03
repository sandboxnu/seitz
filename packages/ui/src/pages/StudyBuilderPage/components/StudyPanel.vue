<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import AddSession from "./AddSession.vue";

const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-200",
  dragClass: "bg-gray-200",
  ghostClass: "invisible",
  handle: ".handle",
  animation: 200,
};

const saveChanges = () => {
  console.log("changes saved");
};
</script>

<template>
  <div class="flex flex-col border border-black overflow-x-hidden p-5">
    <div class="flex flex-row items-center justify-between">
      <div class="flex-none w-4/5">
        <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
          <template #template>
            <ElSkeletonItem variant="text" class="h-11 w-1/2" />
            <ElSkeletonItem variant="text" class="h-8 mt-2 mb-1 w-3/4" />
          </template>
          <template #default>
            <h1 class="text-4xl">
              <input
                v-model="studyBuilderStore.name"
                type="text"
                placeholder="Untitled Study"
              />
            </h1>
            <h2 class="text-2xl my-2">
              <input
                v-model="studyBuilderStore.description"
                type="text"
                placeholder="Add a description"
              />
            </h2>
          </template>
        </ElSkeleton>
      </div>
      <button
        class="text-base bg-gray-200 border border-black rounded-lg px-5 py-1 h-auto justify-center"
        @click="saveChanges"
      >
        Save Changes
      </button>
    </div>
    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow flex flex-row border-2 border-black rounded-xl p-2 overflow-x-auto"
    >
      <TransitionGroup>
        <Draggable
          key="draggable"
          v-model="studyBuilderStore.sessions"
          v-bind="draggableProps"
          class="flex"
          group="sessions"
          item-key="_id"
        >
          <template #item="{ element: sessionId }">
            <SessionCard
              :session-id="sessionId"
              draggable
              class="w-72 m-2 shrink-0"
            />
          </template>
        </Draggable>
      </TransitionGroup>
      <AddSession @add-session="studyBuilderStore.addSession" />
    </div>
  </div>
</template>
