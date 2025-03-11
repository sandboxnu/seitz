<!-- This file displays the MyStudies page, where a user can see a table-view of all their studies and see their most recent studies at the top. A user is able to click on a study card and be taken to the  -->

<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";

import MyStudiesTable from "./components/MyStudiesTable.vue";
import RecentStudiesSection from "./components/RecentStudiesSection.vue";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data, refetch } = useQuery({
  queryKey: ["studies"],
  queryFn: studiesAPI.getStudies,
});

const { mutate, isLoading } = useMutation({
  mutationFn: () => studiesAPI.createStudy(),
  onSuccess: (createdStudyId) => {
    router.push({ name: "study", params: { id: createdStudyId } });
  },
});

const studies = data;
</script>

<template>
  <div v-loading="isLoading" class="mt-14 mx-auto w-full max-w-7xl px-4">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h1 class="text-3xl font-bold">My Studies</h1>
      <AppButton @click="mutate">+ New Study</AppButton>
    </div>
    <h4 class="mt-8 mb-3 text-neutral-600 font-normal leading-tight">Recent</h4>

    <div class="space-y-6">
      <!-- RECENT STUDIES -->
      <RecentStudiesSection :studies="studies || []" @deleted="refetch" />
      <!-- STUDY TABLE -->
      <MyStudiesTable :studies="studies || []" @deleted="refetch" />
    </div>
  </div>
</template>
