import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { ref } from "vue";
import taskAPI, { GetSingularTaskResponse } from "@/api/tasks";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useBatteryEditingStore = defineStore("batteryEditing", () => {
  const editingBatteryId = ref<string>();

  const isLoading = ref(false);
  const isError = ref(false);
  const batteryData = ref<GetSingularTaskResponse>();

  const queryClient = useQueryClient();

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
      ...batteryData.value,
    });
  }

  function select(batteryId: string) {
    isLoading.value = true;
    editingBatteryId.value = batteryId;
    queryClient
      .fetchQuery(["battery", batteryId], () => taskAPI.getBattery(batteryId))
      .then((data) => {
        batteryData.value = data;
        isLoading.value = false;
      })
      .catch(() => {
        isError.value = true;
        isLoading.value = false;
      });
  }

  return {
    isLoading,
    isError,
    editingBatteryId,
    save,
    batteryData,
    select,
  };
});
