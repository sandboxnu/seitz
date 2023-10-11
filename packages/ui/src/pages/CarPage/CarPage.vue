<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import carAPI from "@/api/example";
import CreateCarForm from "./components/CreateCarForm.vue";

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["cars"],
  queryFn: carAPI.getCars,
});
</script>
<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">Error : {{ error }}</div>
  <div v-else>
    <p v-for="car in data" :key="car._id">{{ car.make }} {{ car.model }} {{ car.year }} - {{ car.miles }} miles</p>
    <CreateCarForm />
  </div>
</template>

<style scoped></style>
