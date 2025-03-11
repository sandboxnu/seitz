<!-- This component displays a task in the task library with its name, description, and image. It also has an "Add to bank" button -->
<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  imageUrl: string;
}>();
defineEmits(["add"]);
</script>

<template>
  <div
    class="p-4 bg-neutral-10 border border-neutral-300 rounded-2xl flex gap-5"
  >
    <ElImage
      :src="imageUrl"
      fit="cover"
      class="flex-none h-24 w-24 rounded-[10px] overflow-hidden"
    />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="text-sm text-neutral-600 truncate font-bold">
        {{ name }}
      </div>
      <div class="text-xs text-neutral-600 font-medium line-clamp-3">
        {{ description }}
      </div>
      <div class="grow"></div>
      <div
        class="text-sm text-primary-300 self-end font-bold cursor-pointer"
        @click="$emit('add')"
      >
        + Add to bank
      </div>
    </div>
  </div>
</template>
