<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import RecentStudiesComponent from "./RecentStudiesComponent.vue";
import studiesAPI from "@/api/studies";

const { data: recentStudies } = useQuery({
  queryKey: ["studies", "recent"],
  queryFn: studiesAPI.fetchRecentStudies,
});
</script>

<template>
  <!-- calls 3 most recent, variants and status are currently placeholders -->
  <div v-if="recentStudies?.length" class="flex flex-col gap-4">
    <RecentStudiesComponent
      v-for="s in recentStudies"
      :key="s._id"
      :title="s.name || 'Untitled Study'"
      :description="s.description"
      :variants="50"
      :lastModified="new Date()"
      status="Editing"
    />
  </div>
  <p v-else class="text-sm text-stone-500">No recent studies yet.</p>
</template>
