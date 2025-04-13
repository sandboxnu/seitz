<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import ConditionPanel from "./components/ConditionPanel.vue";
import ConditionsSidebar from "./components/ConditionsSidebar.vue";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.currentUser) {
    router.push("/login");
  }
});
</script>
<template>
  <div class="flex flex-row">
    <div class="w-3/4">
      <ConditionPanel />
    </div>

    <div class="w-1/5">
      <ConditionsSidebar />
    </div>
  </div>
</template>
