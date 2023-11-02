<script setup lang="ts">
defineProps<{ name: string; draggable: boolean }>();
</script>

<template>
  <div
    :class="[
      'border',
      'rounded-lg',
      'p-2',
      'border-black',
      { 'cursor-pointer': draggable },
    ]"
  >
    <FontAwesomeIcon
      v-if="draggable"
      :icon="['fas', 'grip-vertical']"
      class="handle cursor-pointer pr-1"
    />
    {{ name }}
  </div>
</template>
