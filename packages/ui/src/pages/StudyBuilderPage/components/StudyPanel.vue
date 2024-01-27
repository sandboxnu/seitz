<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import AppButton from "@/components/ui/AppButton.vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import SessionAdd from "./SessionAdd.vue";
import StudyServerCode from "./StudyServerCode.vue";

const studyBuilderStore = useStudyBuilderStore();

const draggableProps = {
  chosenClass: "bg-gray-200",
  dragClass: "bg-gray-200",
  ghostClass: "invisible",
  handle: ".handle",
  animation: 200,
};
</script>

<template>
  <div class="flex flex-col border border-black overflow-x-hidden p-5">
    <div class="flex flex-row items-center gap-2 mb-2">
      <div class="flex-1">
        <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
          <template #template>
            <ElSkeletonItem variant="text" class="h-11 w-1/2" />
            <ElSkeletonItem variant="text" class="h-8 mt-2 mb-1 w-3/4" />
          </template>
          <template #default>
            <h1 class="text-4xl">
              <input
                v-model="studyBuilderStore.name"
                class="w-full"
                type="text"
                placeholder="Untitled Study"
              />
            </h1>
            <h2 class="text-2xl my-2">
              <input
                v-model="studyBuilderStore.description"
                class="w-full"
                type="text"
                placeholder="Add a description"
              />
            </h2>
          </template>
        </ElSkeleton>
      </div>
      <div
        class="flex-1 flex gap-2 items-end justify-end min-w-[200px] flex-wrap"
      >
        <StudyServerCode class="shrink grow-0 min-w-0" />
        <AppButton class="flex-none" @click="studyBuilderStore.saveStudyStore">
          Save Changes
        </AppButton>
      </div>
    </div>
    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow border-2 border-black rounded-xl overflow-x-hidden"
    >
      <div class="w-full h-full flex flex-row overflow-x-auto">
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
        <SessionAdd @add-session="studyBuilderStore.addSession" />
      </div>
    </div>
  </div>
</template>
