// handles the authentication state, the currently logged-in user.

import { defineStore } from "pinia";
import { useStorage, StorageSerializers } from "@vueuse/core";
import authAPI from "@/api/auth";

export interface IUser {
  _id: string;
  email: string;
  isAdmin: boolean;
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
