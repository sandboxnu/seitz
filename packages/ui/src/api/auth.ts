import axiosInstance from "@/util/axios";

export interface LogInDto {
  email: string;
  password: string;
}

interface GetUserResponse {
  email: string;
  password: string;
  isAdmin: boolean;
  studies: string[];
}

async function logIn(credentials: LogInDto) {
  await axiosInstance.post("auth/login", credentials);
}

async function signUp(credentials: LogInDto) {
  await axiosInstance.post("/auth/signup", credentials);
}

async function logOut() {
  await axiosInstance.post("/auth/logout");
}

async function getCurrentUser() {
  const result = await axiosInstance.get<GetUserResponse>("auth/user");
  return result.data;
}

export default { logIn, signUp, logOut, getCurrentUser };
