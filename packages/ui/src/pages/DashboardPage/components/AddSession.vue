<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineEmits } from "vue";

const emit = defineEmits(["add-session"]);

const addSession = () => {
  emit("add-session");
};
</script>

<template>
  <div
    class="flex flex-col w-72 m-2 shrink-0 p-6 border rounded-xl border-black justify-center items-center bg-gray-200"
    @click="addSession"
  >
    <FontAwesomeIcon :icon="['fas', 'plus']" class="fa-8x" />
    <div class="text-2xl">Add Session</div>
  </div>
</template>
