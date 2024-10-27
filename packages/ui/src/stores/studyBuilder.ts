import { defineStore } from "pinia";
import { ref, watch } from "vue";
import mongoose from "mongoose";

import studiesAPI, { VariantFromQuery } from "@/api/studies";
import tasksAPI from "@/api/tasks";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import { ElNotification } from "element-plus";
import { useAuthStore } from "./auth";

import type { ChangeEvent } from "@/types/ChangeEvent";
import type {
  PUTStudy,
  ISession,
  ITaskInstance,
  DTO,
  GETTasks,
  GETCustomizedTask,
} from "@seitz/shared";

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  const route = useRoute();
  const router = useRouter();
  const queryClient = useQueryClient();

  const authStore = useAuthStore();

  const { mutate } = useMutation({
    mutationFn(studyData: PUTStudy) {
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
  const currentVariantId = ref<string>("");
  const isStudyLoading = ref(false);
  const isStudySaving = ref(false);
  const studyName = ref<string>();
  const description = ref<string>();
  const variantName = ref<string>();
  const variants = ref<VariantFromQuery[]>([]);
  const taskData = ref<Record<string, DTO<GETCustomizedTask>>>({});
  const taskBank = ref<string[]>([]);
  const sessionData = ref<Record<string, DTO<ISession>>>({});
  const sessions = ref<string[]>([]);
  const serverCode = ref<string>("");

  function initialize() {
    if (route.name !== "study") return;

    studyId.value = routeStudyId();
    isStudyLoading.value = true;
    studyName.value = undefined;
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
        studyName.value = studyData.name;
        description.value = studyData.description;
        variants.value = studyData.variants;

        if (variants.value.length > 0) {
          currentVariantId.value = studyData.variants[0]._id;
          loadVariant(currentVariantId.value);
        }

        taskData.value = {};
        studyData.batteries.forEach((b) => {
          taskData.value[b._id] = b;
        });
        taskBank.value = studyData.batteries.map((b) => b._id);
        isStudyLoading.value = false;
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

  function addTaskInstance(task: DTO<GETTasks>[0]) {
    let existingCount = 0;
    for (const taskId of taskBank.value) {
      if (taskData.value[taskId].battery._id === task._id) existingCount += 1;
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
    event: ChangeEvent<string | DTO<ITaskInstance>, DTO<ITaskInstance>>
  ) {
    const session = sessionData.value[sessionId];

    function taskAdded(taskIndex: number, element: DTO<ITaskInstance>) {
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

  function switchVariant(variantId: string) {
    if (currentVariantId.value !== variantId) {
      currentVariantId.value = variantId;
      loadVariant(currentVariantId.value);
    }
  }

  function loadVariant(variantId: string) {
    const variant = variants.value.find((v) => v._id === variantId);
    if (variant) {
      variant.sessions.forEach((s) => {
        sessionData.value[s._id] = s;
      });
      sessions.value = variant.sessions.map((s) => s._id);
      serverCode.value = variant.serverCode;
      variantName.value = variant.name;
    }
  }

  function saveStudyStore() {
    if (isStudyLoading.value || isStudySaving.value || !authStore.currentUser)
      return;

    const updatedVariants = variants.value.map((v) => {
      if (v._id === currentVariantId.value) {
        return {
          ...v,
          name: variantName.value ?? "",
          sessions: sessions.value.map((id) => sessionData.value[id]),
          serverCode: serverCode.value,
        };
      }
      return v;
    });

    variants.value = updatedVariants;

    mutate({
      _id: studyId.value!,
      name: studyName.value ?? "",
      description: description.value ?? "",
      batteries: taskBank.value.map((id) => taskData.value[id]), // TODO: fix this
      variants: updatedVariants,
      owner: authStore.currentUser._id,
    });
  }

  watch(() => route.params.id, initialize, { immediate: true });

  return {
    studyId,
    currentVariantId,
    variantName,
    variants,
    isStudyLoading,
    isStudySaving,
    name: studyName,
    description,
    taskBank,
    taskData,
    sessions,
    sessionData,
    serverCode,
    switchVariant,
    addSession,
    saveStudyStore,
    handleChange,
    addTaskInstance,
  };
});
