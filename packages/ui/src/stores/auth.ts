import { defineStore } from "pinia";
import { useStorage, StorageSerializers } from "@vueuse/core";
import authAPI from "@/api/auth";
import { Role } from "@seitz/shared";

export interface IUser {
  _id: string;
  email: string;
  role: Role;
  studies: string[];
}

export const useAuthStore = defineStore("auth", () => {
  const currentUser = useStorage<IUser | null>("currentUser", null, undefined, {
    serializer: StorageSerializers.object,
  });

  function logOut() {
    authAPI.logOut();
    currentUser.value = null;
  }

  return { currentUser, logOut };
});
