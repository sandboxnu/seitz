import axios from "axios";

import type { DTO, IUser, LoginDTO, SignupDTO } from "@seitz/shared";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

type GETUserResponse = DTO<Omit<IUser, "password" | "verifyPassword">>;

async function logIn(credentials: LoginDTO) {
  await axiosInstance.post("auth/login", credentials);
}

async function signUp(credentials: SignupDTO) {
  await axiosInstance.post("/auth/signup", credentials);
}

async function logOut() {
  await axiosInstance.post("/auth/logout");
}

async function getCurrentUser() {
  const result = await axiosInstance.get<GETUserResponse>("auth/user");
  return result.data;
}

async function updateCurrentUser(
  data: Partial<Omit<IUser, "password" | "verifyPassword">> & {
    password?: string;
  }
) {
  const result = await axiosInstance.put<GETUserResponse>("auth/user", data);
  return result.data;
}

async function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  await axiosInstance.post("auth/user/password", data);
}

export default {
  logIn,
  signUp,
  logOut,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
};
