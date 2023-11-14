<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}
</script>
<template>
  <h1>ADMIN PAGE</h1>
  hi you are an admin :D
</template>
