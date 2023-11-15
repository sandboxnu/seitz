import { defineStore } from "pinia";
import { ref } from "vue";
import * as _ from "lodash";
// import { useMutation } from "@tanstack/vue-query";
// import { AxiosError } from "axios";
// import studiesAPI from "@/api/studies";
// import { ElNotification } from "element-plus";

export const useStudyBuilderStore = defineStore("studyBuilder", () => {
  // const studyId = ref(null);

  // const { mutate } = useMutation<void, AxiosError<Error>>({
  //   mutationFn: studiesAPI.createOrUpdateStudy,
  //   onSuccess: async () => {
  //     ElNotification({
  //       title: "Saved!",
  //     });
  //   },
  //   onError: (err) => {
  //     ElNotification({
  //       title: "Error",
  //       message: err.response?.data.message ?? "",
  //       type: "error",
  //     });
  //   },
  // });

  // function submit() {
  //   mutate(sessions.value);
  // }

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
