<template>
  <div>
    <select v-model="selectedRole" class="dropdown-select">
      <option disabled value="">Select a role</option>
      <option v-for="role in roles" :key="role" :value="role">
        {{ role }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedRole = ref("");
const roles = ["Super Admin", "Basic User", "Study Manager", "User Manager"];
</script>

<style scoped>
.dropdown-select {
  padding: 3px;
  font-size: 15px;
  margin: 5px 0;
  border: 0.5px solid black;
}
</style>
