<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";

const props = defineProps<{ batteryId: string }>();

const { isLoading, isError, data } = useQuery({
  queryKey: ["tasks", props.batteryId],
  queryFn: () => tasksAPI.getTask(props.batteryId),
});
</script>

<template>
  <template v-if="isLoading">Loading...</template>
  <template v-else-if="isError">Error</template>
  <template v-else>
    {{ data!.name }}
    <div v-for="stage in data!.stages" :key="stage._id">
      {{ stage.stageLabel }}
      <div v-for="option in stage.options" :key="option._id">
        <template v-if="option.type == 'dropdown'">
          <ElFormItem :label="option.name">
            <ElSelect placeholder="select option">
              <ElOption
                v-for="dropdownOption in option.options"
                :key="dropdownOption"
                :label="dropdownOption"
                :value="dropdownOption"
              ></ElOption>
            </ElSelect>
          </ElFormItem>
        </template>
        <template v-else-if="option.type == 'number'">
          <ElFormItem :label="option.name">
            <ElInputNumber
              :min="option.min"
              :max="option.max"
              :step="option.step"
              placeholder="0"
            ></ElInputNumber>
          </ElFormItem>
        </template>
        <template v-else-if="option.type == 'text'">
          <ElFormItem :label="option.name">
            <ElInput type="textarea" placeholder="type here"></ElInput>
          </ElFormItem>
        </template>
        <template v-else-if="option.type == 'checkbox'">
          <ElFormItem :label="option.name">
            <ElCheckboxGroup>
              <ElCheckbox label="Option 1"></ElCheckbox>
              <ElCheckbox label="Option 2"></ElCheckbox>
              <ElCheckbox label="Option 3"></ElCheckbox>
              <ElCheckbox label="Option 4"></ElCheckbox>
            </ElCheckboxGroup>
          </ElFormItem>
        </template>
      </div>
    </div>
  </template>
</template>
