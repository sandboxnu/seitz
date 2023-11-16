<script setup lang="ts">
import { ref } from "vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import AddSession from "./AddSession.vue";

const sessions = ref([
  { id: 1, name: "First Session" },
  { id: 2, name: "Another Session" },
  { id: 3, name: "Session 3" },
  { id: 4, name: "Session 4" },
  { id: 5, name: "Session 5" },
  { id: 6, name: "Session 6" },
]);

const addSession = () => {
  const newSession = {
    id: sessions.value.length + 1,
    name: "",
  };

  sessions.value.push(newSession);
};

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
        <h1 class="text-4xl">
          <input type="text" placeholder="Untitled Study" />
        </h1>
        <h2 class="text-2xl my-2">
          <input type="text" placeholder="Add a description" />
        </h2>
      </div>
      <button
        class="text-base bg-gray-200 border border-black rounded-lg px-5 py-1 h-auto justify-center"
        @click="saveChanges"
      >
        Save Changes
      </button>
    </div>
    <div
      class="grow flex flex-row border-2 border-black rounded-xl p-2 overflow-x-auto"
    >
      <TransitionGroup>
        <Draggable
          key="draggable"
          v-model="sessions"
          v-bind="draggableProps"
          class="flex"
          group="sessions"
          item-key="id"
        >
          <template #item="{ element }">
            <SessionCard
              :key="element.id"
              :name="element.name"
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
