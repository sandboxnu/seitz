<!-- This component handles the fetching and displaying of a list of cars. -->

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import carAPI from "@/api/example";
import CreateCarForm from "./components/CreateCarForm.vue";
import DraggableList from "./components/DraggableList.vue";
import { useDragStore } from "@/stores/drag";

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["cars"],
  queryFn: carAPI.getCars,
});

const dragStore = useDragStore();
</script>
<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">Error : {{ error }}</div>
  <div v-else>
    <p v-for="car in data" :key="car._id">
      {{ car.make }} {{ car.model }} {{ car.year }} - {{ car.miles }} miles
    </p>
    <CreateCarForm />
  </div>

  <DraggableList
    v-for="idx in dragStore.lists.length"
    :key="idx - 1"
    :idx="idx - 1"
    class="border-2 m-1 w-40 h-40 inline-block align-top"
  />

  <br />

  {{ dragStore.lists }}
</template>

<style scoped></style>
