<!-- This component displays all studies in a table format using proper HTML table elements -->

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  studies: {
    _id: string;
    name: string;
    description: string;
    status?: string;
    conditions?: number;
    lastModified?: string;
  }[];
}>();

const hasStudies = computed(() => props.studies && props.studies.length > 0);
</script>

<template>
  <div class="rounded-xl border border-neutral-300 overflow-y-auto">
    <table v-if="hasStudies" class="w-full">
      <thead>
        <tr class="bg-neutral-50 border-b border-neutral-300 h-14 max-h-[56px]">
          <th
            class="px-8 py-2 text-left text-neutral-600 text-lg font-bold w-[212px]"
          >
            Name
          </th>
          <th class="px-4 py-2 text-left text-neutral-600 text-lg font-bold">
            Description
          </th>
          <th
            class="px-4 py-2 text-left text-neutral-600 text-lg font-bold w-[150px]"
          >
            Status
          </th>
          <th
            class="px-4 py-2 text-center text-neutral-600 text-lg font-bold w-[110px]"
          >
            Conditions
          </th>
          <th
            class="px-8 py-2 text-left text-neutral-600 text-lg font-bold w-[180px]"
          >
            Last Modified
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="study in studies"
          :key="study._id"
          class="bg-neutral-10 border-b border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          <td class="px-8 py-4 text-neutral-600 text-lg font-normal w-[212px]">
            <RouterLink :to="{ name: 'study', params: { id: study._id } }">
              {{ study.name }}
            </RouterLink>
          </td>
          <td
            class="px-8 pt-5 text-neutral-600 text-lg font-normal line-clamp-1"
          >
            {{ study.description }}
          </td>
          <td class="px-4 py-4">
            <div
              class="px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100 inline-block"
            >
              <div class="text-neutral-600 text-lg font-normal leading-tight">
                Editing
              </div>
            </div>
          </td>
          <td
            class="px-4 py-4 text-center text-neutral-600 text-lg font-normal"
          >
            50
          </td>
          <td class="px-8 py-4 text-neutral-500 text-lg font-normal">
            10.24.2024
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="p-6 text-neutral-500 text-center">
      You haven't created any studies yet. Click the "+ New Study" button to get
      started.
    </div>
  </div>
</template>
