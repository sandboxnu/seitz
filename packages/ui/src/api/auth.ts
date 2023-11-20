import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface LogInDto {
  email: string;
  password: string;
}

interface GetUserResponse {
  email: string;
  password: string;
  isAdmin: boolean;
  activitiesCreated: string[];
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
