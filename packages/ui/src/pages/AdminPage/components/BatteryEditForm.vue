<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBatteryEditingStore } from "../../../stores/admin";
import AppButton from "../../../components/ui/AppButton.vue";
import BatteryEditFormSection from "./BatteryEditFormSection.vue";

const store = useBatteryEditingStore();
const { isLoading, isError, batteryData } = storeToRefs(store);

// const deleteMutation = useMutation(taskAPI.deleteTask, {
//   onSuccess: () => {
//     queryClient.invalidateQueries(["tasks"]);
//     ElNotification({
//       title: "Success",
//       message: "Battery deleted successfully",
//       type: "success",
//     });
//   },
// });
</script>

<template>
  <template v-if="!isLoading && isError">Error</template>
  <div v-if="batteryData" class="h-full flex flex-col gap-8">
    <div class="flex-none flex">
      <div class="flex-none flex items-center gap-2">
        <h1 class="text-xl font-bold">{{ batteryData.name }}</h1>
        <ElImage src="/mdi_pencil.svg" class="h-6" />
      </div>
      <div class="grow"></div>
      <AppButton>Delete Template</AppButton>
    </div>
    <div class="flex-1 flex overflow-auto">
      <div class="xl:basis-72 basis-56 flex flex-col gap-9">
        <ElImage
          :src="batteryData.imageUrl"
          fit="cover"
          class="self-center flex-none h-full w-full max-h-[200px] max-w-[200px] rounded-[10px] overflow-hidden"
        />
        <el-form
          :model="batteryData"
          label-width="120px"
          label-position="top"
          class="flex flex-col gap-9"
        >
          <el-form-item label="Name" prop="name">
            <el-input v-model="batteryData.name" />
          </el-form-item>
          <el-form-item label="Description" prop="description">
            <el-input
              v-model="batteryData.description"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="flex-1 flex flex-col">
        <template v-if="batteryData.stages.length == 0">
          <div class="flex-1 flex w-full items-center justify-center">
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
    <div class="flex-none flex gap-5">
      <AppButton @click="store.editingBatteryId = undefined">Cancel</AppButton>
      <div class="grow"></div>
      <AppButton> Preview Template </AppButton>
      <AppButton @click="store.save"> Save Template </AppButton>
    </div>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
