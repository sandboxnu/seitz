<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/vue-query";
import adminAPI from "@/api/admin";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}

const { data } = useQuery({
  queryKey: ["admin", "stages"],
  queryFn: adminAPI.getStages,
});
</script>
<template>
  <h1 class="text-2xl">Stages</h1>
  <div v-for="stage in data" :key="stage._id" class="border border-black p-4">
    <div class="text-xl">{{ stage.type }} - {{ stage.stageLabel }}</div>
    <div v-for="option in stage.options" :key="option.name">
      <span class="font-bold">{{ option.name }} ({{ option.type }}):</span>
      {{ option.default }}
    </div>
  </div>
</template>
