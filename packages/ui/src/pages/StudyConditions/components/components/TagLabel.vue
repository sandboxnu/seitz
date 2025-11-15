<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  label: string;
}>();

// Map tag labels to their respective svg icons. Add to this when creating new tags
const tagIconMap: Record<string, string> = {
  cognitive: "/brain.svg",
  vision: "/vision.svg",
};

const icon = computed(() => {
  const key = props.label?.toLowerCase?.() ?? "";
  return tagIconMap[key] ?? "/vision.svg"; // default icon if not mapped (maybe need a diff one?)
});
</script>

<template>
  <div
    class="h-5 p-1 bg-rose-100 rounded outline outline-1 outline-offset-[-1px] outline-red-300 inline-flex justify-center items-center gap-1"
  >
    <img :src="icon" class="w-3 h-2.5 object-contain" />
    <div
      class="justify-center text-orange-700 text-[10px] font-semibold font-['Lato'] leading-3"
    >
      {{ props.label }}
    </div>
  </div>
</template>
