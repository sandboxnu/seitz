<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import carAPI, { GetCarResponse } from "@/api/example";
import { ref } from "vue";

const queryClient = useQueryClient();

const { isLoading, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: carAPI.createCar,
  onSuccess: (createdCar) => {
    queryClient.setQueryData(["cars"], (oldCars: GetCarResponse[] | undefined) => {
      return oldCars ? oldCars.concat([createdCar]) : [createdCar];
    });
  },
});

const carData = ref({
  make: "",
  model: "",
  miles: 0,
  year: 0,
});
</script>

<template>
  <span v-if="isLoading">Adding car...</span>
  <span v-else-if="isError">An error occurred: {{ error }}</span>
  <span v-else-if="isSuccess">Car created!</span>
  <el-form :model="carData" label-width="120px">
    <el-form-item label="Car make">
      <el-input v-model="carData.make" />
    </el-form-item>
    <el-form-item label="Car model">
      <el-input v-model="carData.model" />
    </el-form-item>
    <el-form-item label="Car miles">
      <el-input-number v-model="carData.miles" />
    </el-form-item>
    <el-form-item label="Car year">
      <el-input-number v-model="carData.year" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="mutate(carData)"> Submit </el-button>
    </el-form-item>
  </el-form>
</template>
