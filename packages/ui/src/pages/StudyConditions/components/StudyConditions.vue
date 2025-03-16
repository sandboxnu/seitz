<template>
  <div class="flex items-center gap-2 mb-2">
    <div class="flex-1">
      <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
        <template #template>
          <ElSkeletonItem variant="text" class="h-11 w-1/2" />
          <ElSkeletonItem variant="text" class="h-8 mt-2 mb-1 w-3/4" />
        </template>

        <template #default>
          <div class="flex gap-3 flex-col">
            <input
              v-model="studyBuilderStore.name"
              class="w-full bg-transparent text-neutral-600 font-bold text-4xl"
              type="text"
              placeholder="Untitled Condition"
            />
            <input
              v-model="studyBuilderStore.description"
              class="w-full bg-transparent text-neutral-600 font-medium text-lg"
              type="text"
              placeholder="condition description"
            />
          </div>
        </template>
      </ElSkeleton>
    </div>
  </div>
  <ConditionCard />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ConditionCard from "./components/ConditionCard.vue";
import { useAuthStore } from "@/stores/auth";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const router = useRouter();
const authStore = useAuthStore();
const studyBuilderStore = useStudyBuilderStore();

if (!authStore.currentUser) {
  router.push("/login");
}
</script>
