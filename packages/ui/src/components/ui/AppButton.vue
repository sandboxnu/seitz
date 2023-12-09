<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <button
    class="bg-gray-200 border border-black rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
