import { defineStore } from "pinia";
import { useStorage, StorageSerializers } from "@vueuse/core";
import authAPI from "@/api/auth";

interface IUser {
  email: string;
  password: string;
  activitiesCreated: string[];
  studies: string[];
}

export const useAuthStore = defineStore("auth", () => {
  const currentUser = useStorage<IUser>("currentUser", null, undefined, {
    serializer: StorageSerializers.object,
  });

  function logOut() {
    authAPI.logOut().then(() => {
      currentUser.value = null;
    });
  }

  return { currentUser, logOut };
});
