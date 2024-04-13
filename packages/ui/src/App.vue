<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
</script>

<template>
  <div class="flex flex-row h-screen bg-neutral-50">
    <AppNavbar />
    <div class="flex flex-col w-full h-screen overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
