<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
</script>

<template>
  <AppNavbar />
  <div class="w-40 overflow-x-scroll">
    <RouterView />
  </div>
</template>

<style scoped></style>
