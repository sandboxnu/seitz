<script setup lang="ts">
import { ref } from "vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";

const sessions = ref([
  { id: 1, name: "First Session" },
  { id: 2, name: "Another Session" },
  { id: 3, name: "Session 3" },
  { id: 4, name: "Session 4" },
  { id: 5, name: "Session 5" },
  { id: 6, name: "Session 6" },
]);
</script>

<template>
  <div class="flex flex-col border border-black overflow-x-hidden p-5">
    <h1 class="text-4xl">
      <input type="text" placeholder="Untitled Study" />
    </h1>
    <h2 class="text-2xl my-2">
      <input type="text" placeholder="Add a description" />
    </h2>
    <TransitionGroup>
      <Draggable
        key="draggable"
        v-model="sessions"
        class="grow flex border-2 border-black rounded-xl p-2 overflow-x-scroll"
        group="sessions"
        item-key="id"
        chosen-class="bg-gray-200"
        drag-class="bg-gray-200"
        ghost-class="bg-gray-200"
        handle=".handle"
        :animation="200"
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
  </div>
</template>
