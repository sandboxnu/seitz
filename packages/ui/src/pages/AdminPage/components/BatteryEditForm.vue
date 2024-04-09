<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBatteryEditingStore } from "../../../stores/admin";
import AppButton from "../../../components/ui/AppButton.vue";
import BatteryEditFormSection from "./BatteryEditFormSection.vue";

const store = useBatteryEditingStore();
const { isLoading, isError, batteryData } = storeToRefs(store);
</script>

<template>
  <template v-if="!isLoading && isError">Error</template>
  <div v-if="batteryData" class="h-full flex flex-col">
    <div class="flex justify-end">
      <AppButton @click="store.save"> Save </AppButton>
    </div>
    <div class="flex-1">
      <el-form :model="batteryData" label-width="120px" class="p-6">
        <el-form-item label="Name" prop="name">
          <el-input v-model="batteryData.name" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="batteryData.description" />
        </el-form-item>
      </el-form>
      <template v-if="batteryData.stages.length == 0">
        <div class="flex w-full h-full items-center justify-center">
          <ElEmpty description="No options to customize" />
        </div>
      </template>
      <template v-else>
        <ElForm class="flex-1 flex flex-col overflow-y-auto h-full p-6 pt-0">
          <template v-for="stage in batteryData.stages" :key="stage._id">
            <BatteryEditFormSection :group="stage.options" />
          </template>
        </ElForm>
      </template>
    </div>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
