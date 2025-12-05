<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import AppBreadcrumb from "@/components/ui/AppBreadcrumb.vue";
import ConditionPanel from "./components/ConditionPanel.vue";
import ConditionsSidebar from "./components/ConditionsSidebar.vue";
import { computed, ref } from "vue";

const router = useRouter();
const authStore = useAuthStore();

const collapsePressed = ref(false);
const isCollapsed = computed(() => collapsePressed.value);

onMounted(() => {
  if (!authStore.currentUser) {
    router.push("/login");
  }
});
</script>
<template>
  <div class="bg-neutral-50">
    <AppBreadcrumb />
    <div class="flex flex-row">
      <div
        class="transition-all"
        :style="{ width: `calc(100% - ${isCollapsed ? '4rem' : '300px'})` }"
      >
        <ConditionPanel @open-sidebar="collapsePressed = false" />
      </div>

      <ConditionsSidebar
        class="top-0"
        :collapsed="isCollapsed"
        @collapse-change="(v: boolean) => (collapsePressed = v)"
      />
    </div>
  </div>
</template>
