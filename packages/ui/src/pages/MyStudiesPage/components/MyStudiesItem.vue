<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
import AppButton from "@/components/ui/AppButton.vue";

const emit = defineEmits(["deleted"]);
const props = defineProps<{ name: string; description: string; id: string }>();
const { mutate } = useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    emit("deleted");
  },
});
</script>

<template>
  <RouterLink :to="{ name: 'study', params: { id } }" class="block">
    <div
      class="flex-grow-0 w-auto px-8 py-4 bg-neutral-10 border-b border-neutral-300 justify-between items-center flex"
    >
      <div class="justify-start items-center gap-[32px] flex flex-1">
        <div
          class="w-[182px] text-neutral-600 text-lg font-bold font-['Lato'] leading-tight flex"
        >
          {{ name }}
        </div>
        <div
          class="w-[432px] text-neutral-600 text-lg font-normal font-['Lato'] leading-tight truncate"
        >
          {{ description }}
        </div>
      </div>
      <div class="justify-start items-center gap-[100px] flex">
        <div
          class="px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100 justify-start items-center gap-2 flex"
        >
          <div
            class="text-neutral-600 text-lg font-normal font-['Lato'] leading-tight"
          >
            Editing
          </div>
        </div>
        <div
          class="w-[60px] text-neutral-600 text-lg font-normal font-['Lato'] leading-tight"
        >
          50
        </div>
        <div
          class="w-[110px] text-neutral-500 text-lg font-normal font-['Lato'] leading-tight"
        >
          10.24.2024
        </div>
      </div>
    </div>
  </RouterLink>

  <!-- <div class="flex border-b border-neutral-300 py-6 items-center gap-6">
    <h1 class="whitespace-nowrap text-2xl">
      {{ name }}
    </h1>
    <h2 class="text-base text-gray-500 truncate">
      {{ description }}
    </h2>
    <div class="flex-1"></div>
    <RouterLink :to="{ name: 'study', params: { id } }">
      <AppButton>Edit</AppButton>
    </RouterLink>
    <AppButton @click="mutate">Delete</AppButton>
  </div> -->
</template>
