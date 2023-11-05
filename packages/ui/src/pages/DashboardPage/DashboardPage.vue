<script setup lang="ts">
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";
</script>

<template>
  <div class="grow flex">
    <TaskBank class="flex-none w-72" />
    <StudyPanel class="flex-1" />
  </div>
</template>
