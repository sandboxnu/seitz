<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";
import TaskLibraryItem from "./TaskLibraryItem.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import AppButton from "@/components/ui/AppButton.vue";

const { isLoading, isError, data, refetch } = useQuery({
  queryKey: ["tasks"],
  queryFn: tasksAPI.getAllTasks,
});

const studyBuilderStore = useStudyBuilderStore();
</script>

<template>
  <template v-if="isError && !isLoading">
    <div class="w-full h-full flex flex-col justify-center items-center">
      <ElEmpty description="Error loading task library" />
      <AppButton @click="refetch">Retry</AppButton>
    </div>
  </template>
  <template v-else>
    <ElSkeleton animated :loading="isLoading">
      <template #template>
        <div class="flex flex-wrap justify-center max-w-[800px] mx-auto">
          <div v-for="i in 16" :key="i" class="w-40 mx-3 mb-3">
            <ElSkeletonItem
              variant="image"
              class="w-40 h-40 rounded-3xl border border-black mb-1"
            />
            <ElSkeletonItem variant="text" class="h-5" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="task in data" :key="task._id">
            <TaskLibraryItem
              :name="task.name"
              :description="task.description"
              :image-url="task.imageUrl"
              @add="studyBuilderStore.addTaskInstance(task)"
            />
          </div>
        </div>
      </template>
    </ElSkeleton>
  </template>
</template>
