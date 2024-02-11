import { defineStore } from "pinia";
import { ref, watch } from "vue";
import mongoose from "mongoose";

import studiesAPI from "@/api/studies";
import tasksAPI from "@/api/tasks";
import type {
  GetStudyResponse,
  ICustomizedBattery,
  ISession,
  ITaskInstance,
} from "@/api/studies";
import type { ChangeEvent } from "@/types/ChangeEvent";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import { ElNotification } from "element-plus";
import { GetTaskResponse } from "@/api/tasks";

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  const route = useRoute();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn(studyData: GetStudyResponse) {
      return studiesAPI.saveStudy(studyData._id, studyData);
    },
    onMutate() {
      isStudySaving.value = true;
    },
    async onSuccess() {
      router.push({ name: "study", params: { id: studyId.value } });
      ElNotification({
        title: "Saved!",
        type: "success",
      });
    },
    onError(err: AxiosError<Error>) {
      ElNotification({
        title: "Error saving study",
        message: err.response?.data.message ?? "",
        type: "error",
      });
    },
    onSettled() {
      isStudySaving.value = false;
    },
  });

  function routeStudyId() {
    if (route.name !== "study") return "";
    const idParam = route.params.id;
    return typeof idParam === "string" ? idParam : idParam[0];
  }

  const studyId = ref<string>("");
  const isStudyLoading = ref(false);
  const isStudySaving = ref(false);
  const name = ref<string>();
  const description = ref<string>();
  const taskData = ref<Record<string, ICustomizedBattery>>({});
  const taskBank = ref<string[]>([]);
  const sessionData = ref<Record<string, ISession>>({});
  const sessions = ref<string[]>([]);
  const serverCode = ref<string>("");

  function initialize() {
    if (route.name !== "study") return;

    studyId.value = routeStudyId();
    isStudyLoading.value = true;
    name.value = undefined;
    description.value = undefined;
    taskData.value = {};
    taskBank.value = [];
    sessionData.value = {};
    sessions.value = [];
    serverCode.value = "";

    queryClient
      .fetchQuery({
        queryKey: ["studies", studyId],
        queryFn: () => {
          return studiesAPI.getStudy(studyId.value!);
        },
      })
      .then((studyData) => {
        name.value = studyData.name;
        description.value = studyData.description;
        taskData.value = {};
        studyData.batteries.forEach((b) => {
          taskData.value[b._id] = b;
        });
        taskBank.value = studyData.batteries.map((b) => b._id);
        sessionData.value = {};
        studyData.sessions.forEach((s) => {
          sessionData.value[s._id] = s;
        });
        sessions.value = studyData.sessions.map((s) => s._id);
        isStudyLoading.value = false;
        serverCode.value = studyData.serverCode;
      })
      .catch((err: AxiosError<Error>) => {
        router.push("/");
        if (err.response?.status == 404) {
          ElNotification({
            title: "Error",
            message: "Study not found",
            type: "error",
          });
        } else {
          ElNotification({
            title: "Error",
            message: "Error loading study",
            type: "error",
          });
        }
      });
  }

  const createCustomTaskMutation = useMutation({
    mutationFn: (data: { batteryId: string; name: string }) =>
      tasksAPI.createCustomTask(data.batteryId, data.name, studyId.value),
  });

  function addTaskInstance(task: GetTaskResponse) {
    let existingCount = 0;
    for (const taskId of taskBank.value) {
      if (taskData.value[taskId].battery === task._id) existingCount += 1;
    }
    createCustomTaskMutation.mutate(
      {
        batteryId: task._id,
        name: task.name + (existingCount == 0 ? "" : ` (${existingCount})`),
      },
      {
        onSuccess: (data) => {
          const newId = data._id;
          taskData.value[newId] = data;
          taskBank.value.push(newId);
        },
      }
    );
  }

  function addSession() {
    const newSession = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: "",
      tasks: [],
    };

    sessions.value.push(newSession._id);
    sessionData.value[newSession._id] = newSession;
  }

  function handleChange(
    sessionId: string,
    event: ChangeEvent<string | ITaskInstance, ITaskInstance>
  ) {
    const session = sessionData.value[sessionId];

    function taskAdded(taskIndex: number, element: ITaskInstance) {
      session.tasks.splice(taskIndex, 0, element);
    }

    function taskRemoved(taskIndex: number) {
      session.tasks.splice(taskIndex, 1);
    }

    if ("added" in event) {
      const element = event.added.element;
      const task =
        typeof element == "string"
          ? {
              _id: new mongoose.Types.ObjectId().toString(),
              task: element,
              quantity: 1,
            }
          : element;
      taskAdded(event.added.newIndex, task);
    } else if ("removed" in event) {
      taskRemoved(event.removed.oldIndex);
    } else {
      taskRemoved(event.moved.oldIndex);
      taskAdded(event.moved.newIndex, event.moved.element);
    }
  }

  function saveStudyStore() {
    if (isStudyLoading.value || isStudySaving.value) return;
    mutate({
      _id: studyId.value!,
      name: name.value ?? "",
      description: description.value ?? "",
      batteries: taskBank.value.map((id) => taskData.value[id]), // TODO: fix this
      sessions: sessions.value.map((id) => sessionData.value[id]),
      serverCode: serverCode.value!,
    });
  }

  watch(() => route.params.id, initialize, { immediate: true });

  return {
    studyId,
    isStudyLoading,
    isStudySaving,
    name,
    description,
    taskBank,
    taskData,
    sessions,
    sessionData,
    serverCode,
    addSession,
    saveStudyStore,
    handleChange,
    addTaskInstance,
  };
});
