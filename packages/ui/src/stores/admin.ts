import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { ref } from "vue";
import taskAPI from "@/api/tasks";
import authAPI from "@/api/auth";
import { ElNotification } from "element-plus";
import type { DTO, IBattery } from "@seitz/shared";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useBatteryEditingStore = defineStore("batteryEditing", () => {
  const editingBatteryId = ref<string>();

  const isLoading = ref(false);
  const isError = ref(false);
  const batteryData = ref<DTO<IBattery>>();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async ({
      batteryId,
      ...batteryDTO
    }: { batteryId: string } & Record<string, any>) => {
      const currentUser = await authAPI.getCurrentUser();
      const response = await taskAPI.editBattery(
        batteryId,
        batteryDTO,
        currentUser._id
      );
      return response;
    },
    onSuccess: () => {
      ElNotification({
        title: "Saved!",
        type: "success",
      });
      queryClient.invalidateQueries(["tasks"]);
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

  function deselect() {
    editingBatteryId.value = undefined;
  }

  return {
    isLoading,
    isError,
    editingBatteryId,
    save,
    batteryData,
    select,
    deselect,
  };
});
