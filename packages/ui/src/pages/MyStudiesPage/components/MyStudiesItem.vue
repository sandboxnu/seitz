<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";
import AppButton from "@/components/ui/AppButton.vue";
import { ref } from "vue";

const emit = defineEmits(["deleted", "open"]);
const props = defineProps<{ name: string; description: string; id: string }>();
const isHovered = ref(false);

const { mutate } = useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    emit("deleted");
  },
});

const handleDoubleClick = () => {
  emit("open", props.id);
};
</script>
<template>
  <tr
    class="border-b-2 cursor-pointer transition-colors"
    @dblclick="handleDoubleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <td
      :class="[
        'py-2 pl-6 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <h1 class="whitespace-nowrap text-xl">
        {{ name }}
      </h1>
    </td>
    <td
      :class="[
        'py-2 pl-4 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <h2 class="text-base text-gray-500 truncate">
        {{ description }}
      </h2>
    </td>
    <td
      :class="[
        'py-2 pl-4 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <div class="flex gap-2 justify-end whitespace-nowrap">
        <RouterLink :to="{ name: 'study', params: { id } }">
          <AppButton @click.stop>Edit</AppButton>
        </RouterLink>
        <AppButton @click="mutate">Delete</AppButton>
      </div>
    </td>
  </tr>
</template>
