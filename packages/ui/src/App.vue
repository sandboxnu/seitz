<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-50">
    <AppNavbar />
    <RouterView />
  </div>
</template>

<style scoped></style>
