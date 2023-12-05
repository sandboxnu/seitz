<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import tasksAPI from "@/api/tasks";
import { ref } from "vue";
import { ICustomizedBattery } from "@/api/studies";

const props = defineProps<{ customBattery: ICustomizedBattery }>();

const queryClient = useQueryClient();

const battery = ref();
const isLoading = ref(true);
const isError = ref(false);
const formValues = ref<Record<string, unknown>>({});

queryClient
  .fetchQuery({
    queryKey: ["tasks", "custom", props.customBattery._id],
    queryFn: () => tasksAPI.getTask(props.customBattery._id),
  })
  .then((task) => {
    battery.value = task.battery;
    const values: Record<string, unknown> = {};

    task.values.forEach((value) => {
      values[value.option] = value.value;
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
  <template v-else-if="battery">
    <div class="mx-6">
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
