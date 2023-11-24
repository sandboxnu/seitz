import { defineStore } from "pinia";
import { ref, watch } from "vue";
import * as _ from "lodash";

import studiesApi from "@/api/studies";
import type { GetStudyResponse } from "@/api/studies";
import type { ChangeEvent } from "@/types/ChangeEvent";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";

interface Task {
  _id: string;
  name: string;
}

export interface TaskInstance {
  key: string;
  taskId: string;
}

interface Session {
  _id: string;
  name: string;
  tasks: { key: string; taskId: string }[];
}

const BLANK_STUDY: GetStudyResponse = {
  name: "",
  description: "",
  batteries: [],
  sessions: [],
};

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  const route = useRoute();

  function routeStudyId() {
    if (route.name == "dashboard") {
      const idParam = route.params.id;
      if (idParam && idParam != "new") {
        return typeof idParam === "string" ? idParam : idParam[0];
      }
    }
    return null;
  }

  const studyId = ref<string | null>(routeStudyId());

  const {
    isLoading: isStudyLoading,
    isError: isStudyError,
    data: studyData,
  } = useQuery({
    queryKey: ["studies", studyId],
    queryFn: () => {
      if (studyId.value) return studiesApi.getStudy(studyId.value);
      else return BLANK_STUDY;
    },
  });

  const name = ref<string>();
  const description = ref<string>();
  const taskData = ref<Record<string, Task>>({});
  const taskBank = ref<string[]>([]);
  const sessionData = ref<Record<string, Session>>({});
  const sessions = ref<string[]>([]);

  watch(studyData, (newData, oldData) => {
    if (!oldData && newData) {
      name.value = newData.name;
      description.value = newData.description;
      taskData.value = {};
      newData.batteries.forEach((b) => {
        taskData.value[b._id] = b;
      });
      taskBank.value = newData.batteries.map((b) => b._id);
      sessionData.value = {};
      newData.sessions.forEach((s) => {
        sessionData.value[s._id] = {
          _id: s._id,
          name: s.name,
          tasks: s.activities.map((a) => ({
            key: _.uniqueId(),
            taskId: a._id,
          })),
        };
      });
      sessions.value = newData.sessions.map((s) => s._id);
    }
  });

  function addSession() {
    const newSession = {
      _id: _.uniqueId(),
      name: "",
      tasks: [],
    };

    sessions.value.push(newSession._id);
    sessionData.value[newSession._id] = newSession;
  }

  function handleChange(
    sessionId: string,
    event: ChangeEvent<string | TaskInstance, TaskInstance>
  ) {
    const session = sessionData.value[sessionId];

    function taskAdded(taskIndex: number, element: TaskInstance) {
      session.tasks.splice(taskIndex, 0, element);
    }

    function taskRemoved(taskIndex: number) {
      session.tasks.splice(taskIndex, 1);
    }

    if ("added" in event) {
      const element = event.added.element;
      const task =
        typeof element == "string"
          ? { taskId: element, key: _.uniqueId() }
          : element;
      taskAdded(event.added.newIndex, task);
    } else if ("removed" in event) {
      taskRemoved(event.removed.oldIndex);
    } else {
      taskRemoved(event.moved.oldIndex);
      taskAdded(event.moved.newIndex, event.moved.element);
    }
  }

  return {
    isStudyLoading,
    isStudyError,
    name,
    description,
    taskBank,
    taskData,
    sessions,
    sessionData,
    addSession,
    handleChange,
  };
});
