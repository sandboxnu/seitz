<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";
import TaskLibraryItem from "./TaskLibraryItem.vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const { isLoading, isError, data } = useQuery({
  queryKey: ["tasks"],
  queryFn: tasksAPI.getAllTasks,
});

const studyBuilderStore = useStudyBuilderStore();
</script>

<template>
  <template v-if="isLoading">Loading...</template>
  <template v-else-if="isError">Error</template>
  <template v-else>
    <div class="flex flex-wrap justify-center max-w-[800px] mx-auto">
      <div v-for="task in data" :key="task._id" class="mx-3 mb-3">
        <TaskLibraryItem
          :name="task.name"
          :description="task.description"
          :image-url="task.imageUrl"
          :selected="studyBuilderStore.hasInstanceOfTask(task._id)"
          @flip="studyBuilderStore.addTaskInstance(task)"
        />
      </div>
    </div>
  </template>
</template>
