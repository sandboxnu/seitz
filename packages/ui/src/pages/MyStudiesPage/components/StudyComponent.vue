<script setup lang="ts">
defineProps<{ name: string; description: string }>();
</script>

<template>
  <div class="flex flex-row border-b border-neutral-300 w-3/4 h-24">
    <div class="flex flex-row my-20 justify-left w-3/5 self-center">
      <h1 class="text-2xl mr-10 self-center">
        {{ name }}
      </h1>
      <h2 class="text-base text-gray-500 self-center truncate">
        {{ description }}
      </h2>
    </div>
    <div class="flex w-2/5 justify-end self-center">
      <RouterLink to="/study">
        <button
          class="text-sm bg-neutral-300 border border-black rounded-lg py-1 w-24 h-8 mr-4"
        >
          Edit
        </button>
      </RouterLink>
      <button
        class="text-sm bg-neutral-300 border border-black rounded-lg py-1 w-24 h-8"
      >
        Delete
      </button>
    </div>
  </div>
</template>
