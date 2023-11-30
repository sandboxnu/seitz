<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";

const props = defineProps<{ batteryId: string }>();

const { isLoading, isError, data } = useQuery({
  queryKey: ["tasks", props.batteryId],
  queryFn: () => tasksAPI.getTask(props.batteryId),
});
</script>

<template>
  <template v-if="isLoading">Loading...</template>
  <template v-else-if="isError">Error</template>
  <template v-else>
    {{ data!.name }}
    <div v-for="stage in data!.stages" :key="stage._id">
      {{ stage.stageLabel }}
      <!-- nested for-loop -->
    </div>
  </template>
</template>
