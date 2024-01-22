<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import MyStudiesItem from "./components/MyStudiesItem.vue";
import { useQuery } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
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
  onSuccess: (createdStudy) => {
    router.push({ name: "study", params: { id: createdStudy._id } });
  },
});

const studies = data;
</script>
<template>
  <div v-loading="isLoading" class="mt-14 mx-auto w-3/4 min-w-[600px]">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold">My Studies</h1>
      <div class="flex-1"></div>
      <AppButton @click="mutate()"> + New Study </AppButton>
    </div>

    <div class="flex flex-col">
      <MyStudiesItem
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
