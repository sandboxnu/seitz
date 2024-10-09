import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useStudyBuilderStore } from "./studyBuilder";
import tasksAPI from "@/api/tasks";
import mongoose from "mongoose";
import { ElNotification } from "element-plus";
import { CreateCustomizedBattery, DTO, GETCustomizedTask } from "@seitz/shared";

export const useTaskEditingStore = defineStore("taskEditing", () => {
  const queryClient = useQueryClient();
  const studyBuilderStore = useStudyBuilderStore();

  const editingTaskId = ref<string>();

  const battery = ref<DTO<GETCustomizedTask>["battery"]>();
  const isLoading = ref(true);
  const isError = ref(false);
  // TODO: Fix the typing here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formValues = ref<Record<string, any>>({});
  const name = ref<string>();

  const saveMutation = useMutation({
    mutationFn: ({
      taskId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isSaveAs,
      ...taskDTO
    }: {
      taskId: string;
      isSaveAs: boolean;
    } & DTO<CreateCustomizedBattery>) => {
      return tasksAPI.saveTask(studyBuilderStore.studyId, taskId, taskDTO);
    },
    onSuccess: ({ data }, { taskId, isSaveAs }) => {
      ElNotification({
        title: "Saved!",
        type: "success",
      });
      studyBuilderStore.taskData[taskId] = data;
      if (isSaveAs) {
        studyBuilderStore.taskBank.push(taskId);
        select(taskId);
      }
    },
  });

  function select(taskId: string) {
    const customBattery = studyBuilderStore.taskData[taskId];
    isLoading.value = true;
    editingTaskId.value = taskId;
    queryClient
      .fetchQuery({
        queryKey: ["tasks", "custom", customBattery._id],
        queryFn: () => tasksAPI.getTask(customBattery._id),
      })
      .then((task) => {
        battery.value = task.battery;
        name.value = task.name;

        formValues.value = {};

        task.values.forEach((value) => {
          formValues.value[value.option] = value.value;
        });

        isLoading.value = false;
      })
      .catch(() => {
        isError.value = true;
        isLoading.value = false;
      });
  }

  function save() {
    if (!editingTaskId.value || !name.value || !battery.value) return;

    saveMutation.mutate({
      isSaveAs: false,
      taskId: editingTaskId.value,
      name: name.value,
      battery: battery.value._id,
      values: Object.entries(formValues.value).map((v) => {
        return {
          option: v[0],
          value: v[1],
        };
      }),
    });
  }

  function saveAs() {
    if (!editingTaskId.value || !name.value || !battery.value) return;

    saveMutation.mutate({
      isSaveAs: true,
      taskId: new mongoose.Types.ObjectId().toString(),
      name: name.value,
      battery: battery.value._id,
      values: Object.entries(formValues.value).map((v) => {
        return {
          option: v[0],
          value: v[1],
        };
      }),
    });
  }

  return {
    editingTaskId,
    battery,
    isLoading,
    isError,
    formValues,
    name,
    select,
    save,
    saveAs,
  };
});
