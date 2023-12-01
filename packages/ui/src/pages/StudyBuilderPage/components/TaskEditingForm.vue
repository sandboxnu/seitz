<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";
import { reactive } from "vue";

const props = defineProps<{ batteryId: string }>();

const { isLoading, isError, data } = useQuery({
  queryKey: ["tasks", props.batteryId],
  queryFn: () => tasksAPI.getTask(props.batteryId),
});

//for storing inputted data, not sure how to represent battery stages
const formData = reactive({
  input: "",
});
</script>

<template>
  <template v-if="isLoading">Loading...</template>
  <template v-else-if="isError">Error</template>
  <template v-else>
    <div class="mx-6">
      <h1 class="text-xl text-black font-bold">{{ data!.name }}</h1>
      <ElForm>
        <div v-for="stage in data!.stages" :key="stage._id">
          <h2 class="text-base text-black font-bold mt-4">
            {{ stage.stageLabel }}
          </h2>
          <div v-for="option in stage.options" :key="option._id">
            <template v-if="option.type == 'dropdown'">
              <ElFormItem :label="option.name" class="block text-black">
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
              <ElFormItem :label="option.name" class="block text-black">
                <ElInputNumber
                  :min="option.min"
                  :max="option.max"
                  :step="option.step"
                  placeholder="0"
                  class="mr-2"
                ></ElInputNumber>
                seconds
              </ElFormItem>
            </template>
            <template v-else-if="option.type == 'text'">
              <ElFormItem :label="option.name" class="block text-black">
                <!-- text-black does not apply to the label, not sure if :label or {{ option.name }} is better -->
                {{ option.name }}
                <ElInput
                  v-model="formData.input"
                  type="textarea"
                  placeholder="type here"
                ></ElInput>
              </ElFormItem>
            </template>
            <template v-else-if="option.type == 'checkbox'">
              <ElFormItem :label="option.name" class="block text-black">
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
      </ElForm>
    </div>
  </template>
</template>
