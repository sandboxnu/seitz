<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <div class="border rounded-lg grow p-2 border-black">
    <FontAwesomeIcon
      :icon="['fas', 'grip-vertical']"
      class="handle cursor-pointer"
    />
    {{ name }}
  </div>
</template>
