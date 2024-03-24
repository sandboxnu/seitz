<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <button
    class="bg-primary-300 text-white border border-primary-400 rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
