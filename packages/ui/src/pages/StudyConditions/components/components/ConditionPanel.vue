<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import ConditionCard from "./ConditionCard.vue";

const studyBuilderStore = useStudyBuilderStore();
</script>

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
              placeholder="Untitled Study"
            />
            <input
              v-model="studyBuilderStore.description"
              class="w-full bg-transparent text-neutral-600 font-medium text-lg"
              type="text"
              placeholder="Add a description"
            />
          </div>
        </template>
      </ElSkeleton>
    </div>
  </div>
  <div>
    <ConditionCard
      v-for="variant in studyBuilderStore.variants"
      :key="variant._id"
      :variant-id="variant._id"
    />
  </div>
</template>
