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

export default { logIn, signUp, logOut, getCurrentUser };
