<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaskEditingStore } from "@/stores/taskEditing";
import AppButton from "@/components/ui/AppButton.vue";
import TaskEditFormSection from "./TaskEditFormSection.vue";

const store = useTaskEditingStore();
const { isLoading, isError, name, battery } = storeToRefs(store);
</script>

<template>
  <template v-if="!isLoading && isError">Error</template>
  <div
    v-else-if="battery"
    v-loading="isLoading"
    class="h-full flex flex-col pt-6"
  >
    <div class="flex gap-2 items-center mb-4 px-6">
      <input
        v-model="name"
        class="flex-1 text-xl font-bold rounded"
        type="text"
        :placeholder="battery.name"
      />
      <AppButton @click="store.save">Save</AppButton>
      <AppButton @click="store.saveAs">Save Copy</AppButton>
    </div>
    <template v-if="battery.stages.length == 0">
      <div class="flex w-full h-full items-center justify-center">
        <ElEmpty description="No options to customize" />
      </div>
    </template>
    <template v-else>
      <ElForm class="flex-1 flex flex-col overflow-y-auto h-full p-6 pt-0">
        <template v-for="stage in battery.stages" :key="stage._id">
          <template v-if="stage.isVisibleToNonAdmins == true">
            <TaskEditFormSection :group="stage.options" :depth="0" />
          </template>
        </template>
      </ElForm>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
