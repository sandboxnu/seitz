<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";
import { ref } from "vue";

const props = defineProps<{ batteryId: string }>();

const queryClient = useQueryClient();

const data = ref();
const isLoading = ref(true);
const isError = ref(false);
const formValues = ref<Record<string, string | number | boolean>>({});

queryClient
  .fetchQuery({
    queryKey: ["tasks", props.batteryId],
    queryFn: () => tasksAPI.getTask(props.batteryId),
  })
  .then((task) => {
    data.value = task;
    const values: Record<string, string | number | boolean> = {};

    task.stages.forEach((stage) => {
      stage.options.forEach((option) => {
        values[option._id] = option.default;
      });
    });

    formValues.value = values;
    isLoading.value = false;
  })
  .catch(() => {
    isError.value = true;
    isLoading.value = false;
  });
</script>

<template>
  <template v-if="isLoading">Loading...</template>
  <template v-else-if="isError">Error</template>
  <template v-else-if="data">
    <div class="mx-6">
      <ElForm style="--el-text-color-regular: black">
        <div class="flex flex-col gap-4">
          <div v-for="stage in data.stages" :key="stage._id">
            <h2 class="text-base text-black font-bold">
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
                    ></ElOption>
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
                  ></ElInputNumber>
                  seconds
                </ElFormItem>
              </template>
              <template v-else-if="option.type == 'text'">
                <ElFormItem :label="option.name" class="block">
                  <ElInput
                    v-model="formValues[option._id]"
                    type="textarea"
                    placeholder="type here"
                  ></ElInput>
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
        </div>
      </ElForm>
    </div>
  </template>
</template>
