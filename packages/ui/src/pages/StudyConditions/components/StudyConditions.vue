<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import ConditionPanel from "./components/ConditionPanel.vue";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.currentUser) {
    router.push("/login");
  }
});
</script>

<template>
  <ConditionPanel />
</template>
