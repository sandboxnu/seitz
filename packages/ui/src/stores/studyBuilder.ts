import { defineStore } from "pinia";
import { ref } from "vue";
import * as _ from "lodash";

interface Session {
  id: string;
  name: string;
  tasks: { id: string; name: string }[];
}

const EXAMPLE_SESSIONS = [
  {
    id: _.uniqueId(),
    name: "First Session",
    tasks: [
      {
        id: _.uniqueId(),
        name: "Boston Naming",
      },
      {
        id: _.uniqueId(),
        name: "AVDAT",
      },
      {
        id: _.uniqueId(),
        name: "Cancellation",
      },
      {
        id: _.uniqueId(),
        name: "Number Line",
      },
    ],
  },
  {
    id: _.uniqueId(),
    name: "Another Session",
    tasks: [
      {
        id: _.uniqueId(),
        name: "AVDAT",
      },
      {
        id: _.uniqueId(),
        name: "Cancellation",
      },
      {
        id: _.uniqueId(),
        name: "Cancellation",
      },
      {
        id: _.uniqueId(),
        name: "Number Line",
      },
    ],
  },
  {
    id: _.uniqueId(),
    name: "Session 3",
    tasks: [
      {
        id: _.uniqueId(),
        name: "Boston Naming",
      },
      {
        id: _.uniqueId(),
        name: "Cancellation",
      },
      {
        id: _.uniqueId(),
        name: "Number Line",
      },
    ],
  },
];

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  const name = ref<string>();
  const description = ref<string>();

  const taskBank = ref([
    {
      name: "Boston Naming",
    },
    {
      name: "AVDAT",
    },
    {
      name: "Cancellation",
    },
    {
      name: "Complex Corsi",
    },
  ]);

  const sessionData = ref<Record<string, Session>>({});
  EXAMPLE_SESSIONS.forEach((s) => {
    sessionData.value[s.id] = s;
  });

  const sessions = ref(EXAMPLE_SESSIONS.map((s) => s.id));

  function addSession() {
    const newSession = {
      id: _.uniqueId(),
      name: "",
      tasks: [],
    };

    sessions.value.push(newSession.id);
    sessionData.value[newSession.id] = newSession;
  }

  function taskAdded(sessionId: string, taskIndex?: number) {
    if (!taskIndex) return;
    const session = sessionData.value[sessionId];

    session.tasks[taskIndex - 1] = {
      ...session.tasks[taskIndex - 1],
      id: _.uniqueId(),
    };
  }

  return {
    name,
    description,
    taskBank,
    sessions,
    sessionData,
    addSession,
    taskAdded,
  };
});
