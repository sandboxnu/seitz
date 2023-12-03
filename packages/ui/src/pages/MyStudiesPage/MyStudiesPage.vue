<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { RouterLink, useRouter } from "vue-router";
import StudyComponent from "./components/StudyComponent.vue";
import { useQuery } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data, refetch } = useQuery({
  queryKey: ["studies"],
  queryFn: studiesAPI.getStudies,
});

const studies = data;
</script>

<template>
  <div class="mt-14 mx-auto w-3/4 min-w-[600px]">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold">My Studies</h1>
      <div class="flex-1"></div>
      <RouterLink
        :to="{ name: 'study', params: { id: 'new' } }"
        class="flex text-sm bg-neutral-300 border border-black rounded-lg py-1 w-30 p-4 h-8 justify-center"
      >
        + New Study
      </RouterLink>
    </div>

    <div class="flex flex-col">
      <StudyComponent
        v-for="study in studies"
        :id="study._id"
        :key="study._id"
        :name="study.name"
        :description="study.description"
        @deleted="refetch"
      />
    </div>
  </div>
</template>
