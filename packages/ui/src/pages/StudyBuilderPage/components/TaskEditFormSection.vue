<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTaskEditingStore } from "@/stores/taskEditing";
import type { DTO, GETCustomizedTask, IOptionGroup } from "@seitz/shared";

const props = defineProps<{
  group: DTO<GETCustomizedTask>["battery"]["stages"][0]["options"];
  depth: number;
}>();
const store = useTaskEditingStore();
const { formValues } = storeToRefs(store);

const isToggled = ref(false);

function toggleStageIncluded() {
  isToggled.value = !isToggled.value;
  const status = isToggled.value ? "on" : "off";
  console.log(`Stage "${props.group.name}" toggled: ${status}`);

  if (props.depth < 2) {
    store.updateStageIncluded(
      props.group as unknown as IOptionGroup,
      isToggled.value
    );
  }
}
</script>

<template>
  <div class="border border-gray-400 rounded-xl p-5 my-2">
    <div class="flex items-center gap-2 mb-4">
      <template v-if="depth < 2">
        <div
          class="ellipseWrapper"
          :style="{ backgroundColor: isToggled ? '#e05846' : '#c3bcb5' }"
          @click="toggleStageIncluded"
        >
          <div class="frameChild" :class="{ active: isToggled }"></div>
        </div>
      </template>
      <h2 class="text-base font-bold">
        {{ group.name }}
      </h2>
    </div>
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
        <TaskEditFormSection :group="option" :depth="depth + 1" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
.ellipseWrapper {
  width: 30px;
  border-radius: 25px;
  background-color: #c3bcb5;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 3px;
  box-sizing: border-box;
}
.frameChild {
  width: 14px;
  position: relative;
  border-radius: 50%;
  background-color: #fffdfd;
  height: 14px;
}
.frameChild.active {
  transform: translateX(10px);
}
</style>
