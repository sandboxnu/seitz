<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import tasksAPI, { GetSingularTaskResponse } from "@/api/tasks";
import { ref } from "vue";
import { ICustomizedBattery } from "@/api/studies";

const props = defineProps<{ customBattery: ICustomizedBattery }>();

const queryClient = useQueryClient();

const battery = ref<GetSingularTaskResponse>();
const isLoading = ref(true);
const isError = ref(false);
// TODO: Fix the typing here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formValues = ref<Record<string, any>>({});

queryClient
  .fetchQuery({
    queryKey: ["tasks", "custom", props.customBattery._id],
    queryFn: () => tasksAPI.getTask(props.customBattery._id),
  })
  .then((task) => {
    battery.value = task.battery;
    formValues.value = {};

    task.values.forEach((value) => {
      formValues.value[value.option] = value.value;
    });

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
  <template v-else-if="battery">
    <template v-if="battery.stages.length == 0">
      <div class="flex w-full h-full items-center justify-center">
        <ElEmpty description="No options to customize" />
      </div>
    </template>
    <div v-else class="mx-6">
      <ElForm style="--el-text-color-regular: black">
        <div class="flex flex-col gap-4">
          <div v-for="stage in battery.stages" :key="stage._id">
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
        </div>
      </ElForm>
    </div>
  </template>
</template>
