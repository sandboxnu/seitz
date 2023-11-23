import { defineStore } from "pinia";
import { ref } from "vue";
import * as _ from "lodash";

import type { ChangeEvent } from "@/types/ChangeEvent";

interface Task {
  id: string;
  name: string;
}

export interface TaskInstance {
  key: string;
  taskId: string;
}

interface Session {
  id: string;
  name: string;
  tasks: { key: string; taskId: string }[];
}

const EXAMPLE_TASK_NAMES = [
  "Boston Naming",
  "AVDAT",
  "Cancellation",
  "Complex Corsi",
];

const EXAMPLE_TASKS: Task[] = EXAMPLE_TASK_NAMES.map((n) => ({
  id: _.uniqueId(),
  name: n,
}));

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  const name = ref<string>();
  const description = ref<string>();

  const taskData = ref<Record<string, Task>>({});
  EXAMPLE_TASKS.forEach((t) => {
    taskData.value[t.id] = t;
  });
  const taskBank = EXAMPLE_TASKS.map((t) => t.id);

  const sessionData = ref<Record<string, Session>>({});
  const sessions = ref<string[]>([]);

  function addSession() {
    const newSession = {
      id: _.uniqueId(),
      name: "",
      tasks: [],
    };

    sessions.value.push(newSession.id);
    sessionData.value[newSession.id] = newSession;
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
