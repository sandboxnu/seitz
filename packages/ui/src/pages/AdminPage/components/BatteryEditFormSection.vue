<script setup lang="ts">
import type { IOptionGroup } from "@/api/tasks";

defineProps<{ group: IOptionGroup }>();
</script>

<template>
  <div class="border border-gray-400 rounded-xl p-5">
    <h2 class="text-base font-bold">
      {{ group.name }}
    </h2>
    <template v-for="option in group.options" :key="option._id">
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
      <template v-else-if="option.type == 'group'">
        <BatteryEditFormSection
          v-if="option.options.length > 0"
          :group="option"
          class="my-2"
        />
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
