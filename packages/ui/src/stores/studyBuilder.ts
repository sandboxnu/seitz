import { defineStore } from "pinia";
import { ref } from "vue";
import * as _ from "lodash";

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
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

  interface Session {
    id: string;
    name: string;
    tasks: { id: string; name: string }[];
  }

  const exampleSessions = [
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

  const sessionData = ref<Record<string, Session>>({});
  exampleSessions.forEach((s) => {
    sessionData.value[s.id] = s;
  });

  const sessions = exampleSessions.map((s) => s.id);

  return { taskBank, sessions, sessionData };
});
