<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <button
    class="bg-primary-400 text-white border border-primary-500 rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
