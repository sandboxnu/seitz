<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";

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
  <div class="flex border-b border-neutral-300 py-6 items-center gap-6">
    <h1 class="whitespace-nowrap text-2xl">
      {{ name }}
    </h1>
    <h2 class="text-base text-gray-500 truncate">
      {{ description }}
    </h2>
    <div class="flex-1"></div>
    <RouterLink
      :to="{ name: 'study', params: { id } }"
      class="flex flex-none text-sm bg-neutral-300 justify-center border border-black rounded-lg py-1 w-20"
    >
      Edit
    </RouterLink>
    <button
      class="flex flex-none text-sm bg-neutral-300 justify-center border border-black rounded-lg py-1 w-20"
      @click="mutate()"
    >
      Delete
    </button>
  </div>
</template>
