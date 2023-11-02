<script setup lang="ts">
import SessionCard from "./components/SessionCard.vue";
import TaskBank from "./components/TaskBank.vue";
</script>

<template>
  <div class="flex">
    <div class="w-72 h-screen border-2 flex flex-col">
      <TaskBank />
    </div>
    <div class="grow h-screen border-2">
      <h1>Study Name goes here</h1>
      <h2>Description goes here</h2>
      <div class="flex flex-row">
        <SessionCard class="w-72 m-2" />
        <SessionCard class="w-72 m-2" />
      </div>
    </div>
  </div>
</template>
