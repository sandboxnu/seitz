<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBatteryEditingStore } from "../../../stores/admin";
import AppButton from "../../../components/ui/AppButton.vue";

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
      <div
        v-for="stage in batteryData.stages"
        :key="stage._id"
        class="border border-gray-400 rounded-xl p-5"
      >
        <h2 class="text-base font-bold">{{ stage.stageLabel }}</h2>
        <div v-for="option in stage.options" :key="option._id">
          <template v-if="option.type == 'dropdown'">
            <ElFormItem :label="option.name" class="block">
              <ElSelect v-model="option.default" placeholder="select option">
                <ElOption
                  v-for="(dropdownOption, index) in option.options"
                  :key="index"
                  :label="dropdownOption"
                  :value="index"
                />
              </ElSelect>
            </ElFormItem>
          </template>
          <template v-else-if="option.type == 'number'">
            <ElFormItem :label="option.name" class="block">
              <ElInputNumber
                v-model="option.default"
                :min="option.min"
                :max="option.max"
                :step="option.step"
                placeholder="0"
                class="mr-2"
              />
            </ElFormItem>
          </template>
          <template v-else-if="option.type == 'text'">
            <ElFormItem :label="option.name" class="block">
              <ElInput
                v-model="option.default"
                type="textarea"
                placeholder="type here"
              />
            </ElFormItem>
          </template>
          <template v-else-if="option.type == 'checkbox'">
            <ElFormItem>
              <ElCheckbox
                v-model="option.default"
                :label="option.name"
                size="large"
              />
            </ElFormItem>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
