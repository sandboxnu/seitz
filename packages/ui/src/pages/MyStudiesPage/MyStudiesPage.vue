<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import MyStudiesItem from "./components/MyStudiesItem.vue";
import StudyDetailsSidebar from "./components/StudyDetailsSidebar.vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";
import AppButton from "@/components/ui/AppButton.vue";
import RecentStudies from "./components/RecentStudies.vue";

const router = useRouter();
const authStore = useAuthStore();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data: studies, refetch } = useQuery({
  queryKey: ["studies"],
  queryFn: studiesAPI.getStudies,
});

const { mutate, isLoading } = useMutation({
  mutationFn: () => studiesAPI.createStudy(),
  onSuccess: (createdStudyId) => {
    router.push({ name: "study", params: { id: createdStudyId } });
  },
});

const selectedStudyId = ref<string | null>(null);
const showSidebar = ref<boolean>(false);

const openSidebar = (studyId: string) => {
  selectedStudyId.value = studyId;
  showSidebar.value = true;
};
</script>

<template>
  <div
    v-loading="isLoading"
    class="mt-14 mx-auto w-full min-w-[600px] px-4 sm:px-6 lg:px-10"
  >
    <RecentStudies />
    <div class="flex items-center">
      <h1 class="text-3xl font-bold">My Studies</h1>
      <div class="flex-1"></div>
      <AppButton @click="mutate">+ New Study</AppButton>
    </div>

    <div class="flex flex-col">
      <MyStudiesItem
        v-for="study in studies"
        :id="study._id.toString()"
        :key="study._id.toString()"
        :name="study.name"
        :description="study.description"
        @deleted="refetch"
        @open="openSidebar"
      />
    </div>
  </div>

  <StudyDetailsSidebar
    :study-id="selectedStudyId"
    :show="showSidebar"
    @close="showSidebar = false"
  />
</template>
