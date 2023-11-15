<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import AddSession from "./AddSession.vue";
import * as _ from "lodash";

const studyBuilderStore = useStudyBuilderStore();

const addSession = () => {
  const newSession = {
    id: _.uniqueId(),
    name: "",
    tasks: [],
  };

  studyBuilderStore.sessions.push(newSession.id);
  studyBuilderStore.sessionData[newSession.id] = newSession;
};

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
    <h1 class="text-4xl">
      <input type="text" placeholder="Untitled Study" />
    </h1>
    <h2 class="text-2xl my-2">
      <input type="text" placeholder="Add a description" />
    </h2>
    <div
      class="grow flex flex-row border-2 border-black rounded-xl p-2 overflow-x-auto"
    >
      <TransitionGroup>
        <Draggable
          key="draggable"
          v-model="studyBuilderStore.sessions"
          v-bind="draggableProps"
          class="flex"
          group="sessions"
          item-key="id"
        >
          <template #item="{ element: sessionId }">
            <SessionCard
              :name="studyBuilderStore.sessionData[sessionId].name"
              :session-id="sessionId"
              draggable
              class="w-72 m-2 shrink-0"
            />
          </template>
        </Draggable>
      </TransitionGroup>
      <AddSession @add-session="addSession" />
    </div>
  </div>
</template>
