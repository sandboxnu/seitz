<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";

const route = useRoute();
const showNavbar = computed(() => route.path !== "/home");
</script>

<template>
  <div class="flex h-screen bg-neutral-50">
    <AppNavbar v-if="showNavbar" />
    <div class="flex flex-col w-full h-screen overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
