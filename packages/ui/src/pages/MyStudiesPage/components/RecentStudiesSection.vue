<!-- This component displays the recent studies section with Element Plus Cards -->

<script setup lang="ts">
import { computed } from "vue";
import RecentStudyCard from "./RecentStudiesItem.vue";

const props = defineProps<{
  studies: {
    _id: string;
    name: string;
    description: string;
  }[];
}>();

const emit = defineEmits(["deleted"]);

const hasStudies = computed(() => props.studies && props.studies.length > 0);
</script>

<template>
  <div class="overflow-x-auto pb-2">
    <div v-if="hasStudies" class="flex gap-6">
      <RecentStudyCard
        v-for="study in studies"
        :id="study._id"
        :key="study._id"
        :name="study.name"
        :description="study.description"
        @deleted="emit('deleted')"
      />
    </div>
    <div
      v-else
      class="p-6 bg-neutral-50 rounded-xl text-neutral-500 text-center"
    >
      You haven't created any studies yet. Click the "+ New Study" button to get
      started.
    </div>
  </div>
</template>
