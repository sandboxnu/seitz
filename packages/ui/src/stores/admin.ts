import { useMutation } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { ref } from "vue";
import taskAPI from "@/api/tasks";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useBatteryEditingStore = defineStore("batteryEditing", () => {
  const editingBatteryId = ref<string>();

  const formValues = ref<Record<string, any>>({});
  const isLoading = ref(true);
  const isError = ref(false);

  const saveMutation = useMutation({
    mutationFn: ({
      batteryId,
      ...batteryDTO
    }: { batteryId: string } & Record<string, any>) => {
      return taskAPI.editBattery(batteryId, batteryDTO);
    },
  });

  function save() {
    if (!editingBatteryId.value) return;

    saveMutation.mutate({
      batteryId: editingBatteryId.value,
      ...formValues.value,
    });
  }

  return {
    isLoading,
    isError,
    editingBatteryId,
    formValues,
    save,
  };
});
