<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits(["add-session"]);

const addSession = () => {
  emit("add-session");
};
</script>

<template>
  <div>
    <button @click="addSession">Add Session</button>
  </div>
</template>
