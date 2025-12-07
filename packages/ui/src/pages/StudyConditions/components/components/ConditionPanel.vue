<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import ConditionCard from "./ConditionCard.vue";

const studyBuilderStore = useStudyBuilderStore();
const emit = defineEmits<(e: "open-sidebar") => void>();
</script>

<template>
  <div class="flex items-center gap-2 mb-2 p-5">
    <div class="flex-1">
      <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
        <template #template>
          <ElSkeletonItem variant="text" class="h-11 w-1/2" />
          <ElSkeletonItem variant="text" class="h-8 mt-2 mb-1 w-3/4" />
        </template>

        <template #default>
          <div class="flex flex-col">
            <input
              v-model="studyBuilderStore.name"
              @change="studyBuilderStore.saveStudyStore"
              class="w-full bg-transparent text-neutral-600 font-bold text-2xl"
              type="text"
              placeholder="Untitled Study"
            />
            <input
              v-model="studyBuilderStore.description"
              @change="studyBuilderStore.saveStudyStore"
              class="w-full bg-transparent text-neutral-600 font-medium text-md"
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
      :draggable="true"
      @click="emit('open-sidebar')"
    />
  </div>
</template>
