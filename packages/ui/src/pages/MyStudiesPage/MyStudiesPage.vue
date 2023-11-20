<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { RouterLink, useRouter } from "vue-router";
import StudyComponent from "./components/StudyComponent.vue";
import { useQuery } from "@tanstack/vue-query";
import studiesApi from "@/api/studies";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data } = useQuery({
  queryFn: studiesApi.getStudies,
});

const studies = data;
</script>

<template>
  <div class="flex justify-center mt-14 mb-6">
    <div class="flex flex-row w-3/4">
      <h1 class="flex w-3/5 text-3xl font-bold">My Studies</h1>
      <div class="flex w-2/5 justify-end">
        <RouterLink to="/study">
          <button
            class="flex text-sm bg-neutral-300 border border-black rounded-lg py-1 w-30 p-4 h-8 justify-center"
          >
            + New Study
          </button>
        </RouterLink>
      </div>
    </div>
  </div>

  <div class="flex flex-col">
    <div v-for="study in studies" :key="study.id" class="flex justify-center">
      <StudyComponent :name="study.name" :description="study.description" />
    </div>
  </div>
</template>
