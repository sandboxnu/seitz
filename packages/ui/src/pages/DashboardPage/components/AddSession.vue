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
  >
    <FontAwesomeIcon
      :icon="['fas', 'plus']"
      class="handle cursor-pointer fa-8x"
      @click="addSession"
    />
    <button class="text-2xl" @click="addSession">Add Session</button>
  </div>
</template>
