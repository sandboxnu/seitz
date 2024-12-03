<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import MyStudiesItem from "./components/MyStudiesItem.vue";
import { useQuery } from "@tanstack/vue-query";
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
import AppButton from "@/components/ui/AppButton.vue";
import RecentStudiesItem from "./components/RecentStudiesItem.vue";

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
  <div v-loading="isLoading" class="mt-14 mx-auto w-3/4 min-w-[600px]">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold">My Studies</h1>
      <div class="flex-1"></div>
      <AppButton @click="mutate">+ New Study</AppButton>
    </div>

    <div
      class="pt-8 pb-3 flex text-neutral-600 text-lg font-normal font-['Lato'] leading-tight"
    >
      Recent
    </div>

    <!-- MY STUDIES BLOCK -->
    <div
      class="w-auto h-[1029px] flex-col justify-start items-start gap-[26px] flex"
    >
      <!-- RECENT STUDIES -->
      <div
        class="self-stretch h-[220px] overflow-y-auto justify-start items-start"
      >
        <div class="flex gap-4">
          <RecentStudiesItem
            v-for="study in studies"
            :id="study._id"
            :key="study._id"
            :name="study.name"
            :description="study.description"
            @deleted="refetch"
          />
        </div>
      </div>
      <!-- STUDY TABLE -->
      <div
        class="self-stretch w-auto h-[824px] rounded-tl-xl rounded-tr-xl border border-neutral-300 flex-col justify-start items-start flex overflow-y-auto"
      >
        <!-- TABLE HEADERS -->
        <div
          class="self-stretch px-8 py-[18px] bg-neutral-50 rounded-tl-xl rounded-tr-xl border-b border-neutral-300 justify-between items-start flex"
        >
          <div class="justify-start items-center gap-[130px] flex">
            <div
              class="w-[82px] text-[#1f1915] text-lg font-bold font-['Lato'] leading-tight"
            >
              Name
            </div>
            <div
              class="w-[432px] text-[#1f1915] text-lg font-bold font-['Lato'] leading-tight"
            >
              Description
            </div>
          </div>
          <div class="justify-start items-center gap-24 flex">
            <div
              class="text-[#1f1915] text-lg font-bold font-['Lato'] leading-tight"
            >
              Status
            </div>
            <div
              class="text-[#1f1915] text-lg font-bold font-['Lato'] leading-tight"
            >
              Conditions
            </div>
            <div
              class="w-[110px] text-[#1f1915] text-lg font-bold font-['Lato'] leading-tight"
            >
              Last Modified
            </div>
          </div>
        </div>
        <!-- STUDIES -->
        <div class="w-auto self-stretch">
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
    </div>
  </div>
</template>
