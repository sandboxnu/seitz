<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStudyBuilderStore } from "@/stores/studyBuilder";

const router = useRouter();
const route = useRoute();
const studyBuilderStore = useStudyBuilderStore();

const isStudyPage = computed(() => route.name === "study");
const isConditionsPage = computed(() => route.name === "conditions");

const studyName = computed(() => studyBuilderStore.name || "Untitled Study");
const conditionName = computed(
  () => studyBuilderStore.variantName || "Untitled Condition"
);
const studyId = computed(() => studyBuilderStore.studyId);

const navigateToStudies = () => {
  router.push({ name: "studies" });
};

const navigateToConditions = () => {
  if (studyId.value) {
    router.push({ name: "conditions", params: { id: studyId.value } });
  }
};
</script>

<template>
  <nav class="flex items-center gap-2 text-sm text-neutral-600 mx-4 mt-4">
    <button
      type="button"
      class="hover:text-neutral-900 transition-colors"
      @click="navigateToStudies"
    >
      All Studies
    </button>
    <span v-if="isStudyPage || isConditionsPage" class="text-neutral-400">
      >
    </span>
    <button
      v-if="isStudyPage"
      type="button"
      class="hover:text-neutral-900 transition-colors"
      @click="navigateToConditions"
    >
      {{ studyName }}
    </button>
    <span v-else-if="isConditionsPage" class="text-neutral-900">
      {{ studyName }}
    </span>
    <span v-if="isStudyPage" class="text-neutral-400"> > </span>
    <span v-if="isStudyPage" class="text-neutral-900">
      {{ conditionName }}
    </span>
  </nav>
</template>
