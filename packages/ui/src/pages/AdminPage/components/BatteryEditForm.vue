<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaskEditingStore } from "../../../stores/taskEditing";
import AppButton from "../../../components/ui/AppButton.vue";

const store = useTaskEditingStore();
const { isLoading, isError, name, battery, formValues } = storeToRefs(store);
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
      <ElForm
        class="flex-1 flex flex-col gap-4 overflow-y-auto h-full p-6 pt-0"
      >
        <div
          v-for="stage in battery.stages"
          :key="stage._id"
          class="border border-gray-400 rounded-xl p-5"
        >
          <h2 class="text-base font-bold">
            {{ stage.stageLabel }}
          </h2>
          <div v-for="option in stage.options" :key="option._id">
            <template v-if="option.type == 'dropdown'">
              <ElFormItem :label="option.name" class="block">
                <ElSelect
                  v-model="formValues[option._id]"
                  placeholder="select option"
                >
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
                  v-model="formValues[option._id]"
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
                  v-model="formValues[option._id]"
                  type="textarea"
                  placeholder="type here"
                />
              </ElFormItem>
            </template>
            <template v-else-if="option.type == 'checkbox'">
              <ElFormItem>
                <ElCheckbox
                  v-model="formValues[option._id]"
                  :label="option.name"
                  size="large"
                />
              </ElFormItem>
            </template>
          </div>
        </div>
      </ElForm>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
