<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaskEditingStore } from "@/stores/taskEditing";
import type { DTO, GETCustomizedTask } from "@seitz/shared";

defineProps<{
  group: DTO<GETCustomizedTask>["battery"]["stages"][0]["options"];
}>();
const store = useTaskEditingStore();
const { formValues } = storeToRefs(store);
</script>

<template>
  <div class="border border-gray-400 rounded-xl p-5 my-2">
    <h2 class="text-base font-bold">
      {{ group.name }}
    </h2>
    <template v-for="option in group.options" :key="option._id">
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
      <template v-else-if="option.type == 'group'">
        <TaskEditFormSection :group="option" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
