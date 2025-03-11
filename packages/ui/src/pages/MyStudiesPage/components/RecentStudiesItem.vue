<!-- This component represents a single card in the "recent studies" top area of the MyStudiesPage. Each card has the study's details (name, description, status, # of conditions, and last modified date). -->

<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
import { ElCard } from "element-plus";

const emit = defineEmits(["deleted"]);
const props = defineProps<{
  name: string;
  description: string;
  id: string;
}>();

useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    emit("deleted");
  },
});
</script>

<template>
  <ElCard
    shadow="hover"
    class="min-w-[400px] max-w-[400px] h-[180px] flex-shrink-0 px-6 py-5 rounded-2xl border border-neutral-300"
  >
    <RouterLink
      :to="{ name: 'study', params: { id } }"
      class="block -m-4 h-full"
    >
      <div class="flex flex-col h-full justify-between gap-3">
        <div>
          <div class="text-neutral-600 text-2xl font-bold leading-7 mb-2">
            {{ name }}
          </div>
          <div
            class="min-h-[36px] text-neutral-600 text-sm font-medium leading-[18px] line-clamp-2"
          >
            {{ description }}
          </div>
        </div>

        <div class="flex justify-between items-end">
          <div class="flex flex-col gap-1">
            <div>
              <span class="text-neutral-600 text-sm font-bold leading-tight"
                >Conditions:
              </span>
              <span class="text-neutral-600 text-sm font-medium leading-[18px]"
                >50</span
              >
            </div>
            <div class="flex items-center gap-1">
              <span class="text-neutral-400 text-sm font-medium"
                >Last Modified</span
              >
              <div class="w-1 h-1 bg-[#b9adaa] rounded-full"></div>
              <span class="text-neutral-400 text-sm font-medium"
                >Oct 24, 2024</span
              >
            </div>
          </div>

          <div
            class="px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100"
          >
            <div class="text-neutral-600 text-base font-normal">Editing</div>
          </div>
        </div>
      </div>
    </RouterLink>
  </ElCard>
</template>
