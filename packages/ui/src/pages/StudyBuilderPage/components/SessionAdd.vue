<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits(["add-session"]);

const addSession = () => {
  emit("add-session");
};
</script>

<template>
  <div
    class="flex flex-col w-72 m-2 shrink-0 p-6 border rounded-xl border-black justify-center items-center bg-gray-200 cursor-pointer"
    @click="addSession"
  >
    <FontAwesomeIcon :icon="['fas', 'plus']" class="fa-8x" />
    <div class="text-2xl">Add Session</div>
  </div>
</template>
