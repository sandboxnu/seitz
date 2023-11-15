<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import StudyPanel from "./components/StudyPanel.vue";
import TaskBank from "./components/TaskBank.vue";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}
</script>

<template>
  <div class="flex-1 flex">
    <TaskBank class="flex-none w-72" />
    <StudyPanel class="flex-1" />
  </div>
</template>
