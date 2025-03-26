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
  <div class="study-conditions-container">
    <div class="condition-panel">
      <ConditionPanel />
    </div>

    <div class="conditions-sidebar">
      <ConditionsSidebar />
    </div>
  </div>
</template>

<style scoped>
.study-conditions-container {
  display: flex;
  flex-direction: row;
}

.condition-panel {
  flex: 3;
}

.conditions-sidebar {
  flex: 1;
  max-width: 300px;
}
</style>
