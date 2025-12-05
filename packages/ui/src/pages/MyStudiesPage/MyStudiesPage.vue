<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import MyStudiesItem from "./components/MyStudiesItem.vue";
import StudyDetailsSidebar from "./components/StudyDetailsSideBar.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";
import AppButton from "@/components/ui/AppButton.vue";
import RecentStudies from "./components/RecentStudies.vue";

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data: studies, refetch } = useQuery({
  queryKey: ["studies"],
  queryFn: studiesAPI.getStudies,
  refetchOnMount: "always",
  staleTime: 0,
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

const handleStudyDeleted = async () => {
  await refetch();
  await queryClient.invalidateQueries({ queryKey: ["studies", "recent"] });
};
</script>

<template>
  <div
    v-loading="isLoading"
    class="pt-14 mx-auto w-full min-w-[600px] px-4 sm:px-6 lg:px-10 bg-neutral-50"
  >
    <div class="flex items-center">
      <h1 class="text-3xl font-bold mb-4 -mt-4">My Studies</h1>
      <div class="flex-1"></div>
      <AppButton class="mb-4 -mt-4" @click="mutate">+ New</AppButton>
    </div>
    <h1 class="mt-4">Recents</h1>
    <RecentStudies />

    <ElCard class="rounded-xl shadow-sm" :body-style="{ padding: 0 }">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th
              class="text-black text-left py-4 pl-6 pr-6 border-b-2 bg-neutral-50"
            >
              Name
            </th>
            <th
              class="text-black text-left py-4 pl-4 pr-6 border-b-2 bg-neutral-50"
            >
              Description
            </th>
            <th
              class="text-black text-left py-4 px-4 border-b-2 bg-neutral-50"
            ></th>
          </tr>
        </thead>
        <tbody>
          <MyStudiesItem
            v-for="study in studies"
            :id="study._id.toString()"
            :key="study._id.toString()"
            :name="study.name"
            :description="study.description"
            @deleted="handleStudyDeleted"
            @open="openSidebar"
          />
        </tbody>
      </table>
    </ElCard>
  </div>

  <StudyDetailsSidebar
    :study-id="selectedStudyId"
    :show="showSidebar"
    @close="showSidebar = false"
  />
</template>
