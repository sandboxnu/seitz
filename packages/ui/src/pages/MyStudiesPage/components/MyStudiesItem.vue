<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
import AppButton from "@/components/ui/AppButton.vue";
import { ref } from "vue";

const emit = defineEmits(["deleted", "open"]);
const props = defineProps<{ name: string; description: string; id: string }>();
const isHovered = ref(false);

const { mutate } = useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    emit("deleted");
  },
});

const handleDoubleClick = () => {
  emit("open", props.id);
};
</script>
<template>
  <div
    :class="[
      'flex border-b border-neutral-300 py-6 items-center gap-6 cursor-pointer transition-colors px-2 -mx-2',
      isHovered ? 'bg-gray-300' : 'bg-white',
    ]"
    @dblclick="handleDoubleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <h1 class="whitespace-nowrap text-2xl">
      {{ name }}
    </h1>
    <h2 class="text-base text-gray-500 truncate">
      {{ description }}
    </h2>
    <div class="flex-1"></div>
    <RouterLink :to="{ name: 'study', params: { id } }">
      <AppButton @click.stop>Edit</AppButton>
    </RouterLink>
    <AppButton @click.stop="mutate">Delete</AppButton>
  </div>
</template>
