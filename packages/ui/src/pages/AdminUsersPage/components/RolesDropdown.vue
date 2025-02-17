<template>
  <div>
    <select v-model="selectedRole" class="dropdown-select">
      <option disabled value="">Select a role</option>
      <option v-for="role in Object.values(Role)" :key="role" :value="role">
        {{ role }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { Role } from "@seitz/shared";
import { ref, defineProps, onMounted } from "vue";
import type { IUser } from "@seitz/shared";

const props = defineProps<{
  user: IUser;
}>();

const selectedRole = ref("");

onMounted(() => {
  let curRole = props.user.role;
  if (!Object.values(Role).includes(curRole)) {
    curRole = Role.BasicUser;
  }
  selectedRole.value = curRole;
});
</script>

<style scoped>
.dropdown-select {
  padding: 3px;
  font-size: 15px;
  margin: 5px 0;
  border: 0.5px solid black;
}
</style>
